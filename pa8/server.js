/**
 * Thomas Obrenovich
 * PA7: Translator Part 2
 * 
 * 
 */

// Import necessary packages and set up server

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 80;

app.use(express.static('public_html'));
app.use(express.json);
const mongodb = "mongodb+srv://tmobreno:Jake8383!@cluster0.zzr1lce.mongodb.net/local_library?retryWrites=true&w=majority"

// Connect to MongoDB database
mongoose.connect(mongodb)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

// Define schema for chat messages and create model
var ChatMessageSchema = new mongoose.Schema({
  alias: String,
  message: String,
  time: { type: Date, default: Date.now }
});

var Chat = mongoose.model('Chat', ChatMessageSchema );

// Handle GET request to /chats
app.get('/chats', (req, res) => {
  // Retrieve all chat messages from database and return as JSON
  Chat.find()
    .then((chats) => res.json(chats))
    .catch((err) => res.status(500).send(err.message));
});


// Handle POST request to /chats/post
app.post('/chats/post', (req, res) => {
  // Extract alias and message from request body
  const { alias, message } = req.body;
  // Create new chat message and save to database
  const chat = new Chat({ alias, message });
  chat.save()
    .then(() => res.sendStatus(200))
    .catch((err) => res.status(500).send(err.message));
});

// Start server listening on specified port
app.listen(port, () => console.log(`Server listening on port ${port}`));