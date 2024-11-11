/**
 * Thomas Obrenovich
 * PA10: Ostaa pt2
 * 
 * The server code to control the retrieval of the users in the database, and display the requests back to the user
 * in a readable format. This encompasses the login and create user functions of the site, allowing the user to create a profile
 * and login as themselves, with a cookie that saves the login sessoin.
 * 
 */

const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 80;

let sessions = {};

// Adds a session for the user
function addSession(user){
  let sessionId = Math.floor(Math.random() * 10000);
  let sessionStart = Date.now();
  sessions[user] = {'sid': sessionId, 'start': sessionStart};
  return sessionId;
}

// Asks if the user has a session
function doesSession(user, sessionId){
  let entry = sessions[user];
  if (entry!= undefined){
    return entry.sid == sessionId;
  }
  return false;
}

// Authenticates the session
function authenticate(req, res, next){
  let co = req.cookies;
  if (co && co.login){
    let result = doesSession(co.login.username, co.login.sid);
    if (result){
      return next();
    }
  }
  if (req.path === '/index.html') {
    return next();
  }
  res.redirect('/index.html');
}

// Redirects the session if the user is autenticated
function redirectHome(req, res) {
  res.redirect('/home.html');
}

app.use(express.json());
app.use(cookieParser());
app.use(/^\/$/, authenticate, redirectHome);
app.use(express.static('public_html'));

const mongodb = "mongodb+srv://name:R366n3UtKSDjRNxI@cluster0.slrqdtn.mongodb.net/?retryWrites=true&w=majority";

// Create the connection to MongoDB and ensure connection works
mongoose.connect(mongodb)
  .then(() => console.log('MongoDB Connection Successful'))
  .catch((err) => console.error('MongoDB Error Caught', err));

// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  purchases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
});
const User = mongoose.model('User', userSchema);

// Define Item schema
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  status: String
});
const Item = mongoose.model('Item', itemSchema);

// Get all users
app.get('/get/users/', (req, res) => {
  User.find({})
    .then((users) => res.end(JSON.stringify(users, null, 2)))
    .catch((err) => console.error('Error Caught', err))
});

// Get all items
app.get('/get/items/', (req, res) => {
  Item.find({})
    .then((items) => res.end(JSON.stringify(items, null, 2)))
    .catch((err) => console.error('Error Caught', err))
});

// Get all listings for a given User
app.get('/get/listings/:username', async (req, res) => {
  const username = req.params.username;
  try{
    const user = await User.findOne({ username: username }).populate('listings');
    const listings = user.listings;
    res.end(JSON.stringify(listings, null, 2));
  } catch(err){
    console.error('Error Caught', err);
  }
});

// Get all purchases for a given User
app.get('/get/purchases/:username', async (req, res) => {
  const username = req.params.username;
  try{
    const user = await User.findOne({ username: username }).populate('purchases');
    const purchases = user.purchases;
    res.end(JSON.stringify(purchases, null, 2));
  } catch(err){
    console.error('Error Caught', err);
  }
});

// Search for users by keyword
app.get('/search/users/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  const regex = new RegExp(keyword, 'i');
  User.find({username: regex}).exec()
    .then((users) => res.end(JSON.stringify(users, null, 2)))
    .catch((err) => console.error('Error Caught', err))
});

// Search for items by keyword
app.get('/search/items/:keyword', (req, res) => {
  const keyword = req.params.keyword;
  const regex = new RegExp(keyword, 'i');
  Item.find({description: regex}).exec()
    .then((items) => res.json(items))
    .catch((err) => console.error('Error Caught', err));
});

// Finds all the purchases for a user
app.post('/purchase/:itemId/:username', (req, res) => {
  const itemId = req.params.itemId;
  const username = req.params.username;
  console.log(itemId);
  const item = Item.findOne({ title: itemId });
  item.then(async (item) => {
    if (!item) {
      return res.status(404).send('Item not found');
    }
    item.status = 'SOLD';
    await item.save();
    const seller = await User.findOne({ username: username });
    if (!seller) {
      return res.status(404).send('Seller not found');
    }
    seller.purchases.push(item._id);
    await seller.save();
    res.json({ success: true });
  })
  .catch((err) => {
    console.error('Error Caught', err);
    res.json({ success: false });
  });
});

// Add a User
app.post('/add/user/', async (req, res) => {
  const username = req.body.user;
  const password = req.body.pass;
  try {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      res.send('Username already exists');
    } else {
      const newUser = new User({username: username, password: password});
      newUser.save()
      .then(() => res.send('User added successfully'))
      .catch((err) => console.error('Error Caught', err));
    }
  } catch (err) {
    console.error('Error Caught', err);
    res.send('Server error');
  }
});

// Login User
app.post('/account/login', (req, res) => {
  let username = req.body.user;
  let password = req.body.pass;
  User.findOne({ username: username, password: password })
    .then((user) => {
      if (user) {
        let sessionId = addSession(username);
        res.cookie('login', { username: username, sid: sessionId }, { maxAge: 100000 });
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    })
    .catch((err) => console.error('Error Caught', err));
});

// Add an Item
app.post('/add/item/:username', async function(req, res) {
  const username = req.params.username;
  const title = req.body.title;
  const description = req.body.descr;
  const image = req.body.image;
  const price = req.body.price;
  const status = req.body.stat;
  try {
    const seller = await User.findOne({ username: username });
    if (!seller) {
      return res.status(404).send('Seller not found');
    }
    const item = new Item({
      title: title,
      description: description,
      image: image,
      price: price,
      status: status
    });
    await item.save();
    seller.listings.push(item._id);
    await seller.save();
    res.send('Item added successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));