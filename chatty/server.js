/**
 * Thomas Obrenovich
 * PA8: Chatty
 * 
 * The chat system that is live on the web, allowing for communication through the site.
 * 
 * This is the server end of the code, managing the MongoDB database and allowing for the storage of messages which the user sends
 * using post requests. That data is then displayed back to all users in the chat message area of the site.
 * 
 */

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 80;

app.use(express.static('public_html'));
app.use(express.json());

const mongodb = "mongodb+srv://name:BEEeEcrYd2Hfir29@chatmessages.iiihikg.mongodb.net/?retryWrites=true&w=majority";

// Create the connection to MongoDB and ensure connection works
mongoose.connect(mongodb)
  .then(() => console.log('MongoDB Connection Successful'))
  .catch((err) => console.error('MongoDB Error Caught', err));

// Define the schema specified for chat messages and later retrieval
var ChatMessageSchema = new mongoose.Schema({
  alias: String,
  message: String,
  time: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', ChatMessageSchema );

// Handle POST request
app.post('/chats/post', (req, res) => {
  const {alias, message} = req.body;
  const newChat = new Chat({alias, message});
  newChat.save()
    .then(() => res.sendStatus(200))
    .catch((err) => console.error('Error Caught', err));
});

// Handle GET
app.get('/chats', (req, res) => {
  Chat.find()
    .then((chats) => res.json(chats))
    .catch((err) => console.error('Error Caught', err));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));