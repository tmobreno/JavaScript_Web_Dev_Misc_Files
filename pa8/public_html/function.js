/**
 * Thomas Obrenovich
 * PA7: Translator Part 2
 * 
 */

let messagesList = document.getElementById('chatContent');
let aliasInput = document.getElementById('Alias');
let messageInput = document.getElementById('Message');
let sendButton = document.getElementById('Submit');

// Function to send message to server
function sendMessage() {
    // Get alias and message text from input fields
    const alias = aliasInput.value.trim();
    const message = messageInput.value.trim();
    // Send POST request to server with alias and message in body
    fetch('/chats/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: 'examplealias', message: 'examplemessage' })
    })
      .then(() => {
        messageInput.value = '';
      })
      .catch((err) => console.error('Error sending message:', err));
}
  
// Add event listener to send button
sendButton.addEventListener('click', sendMessage);
  
// Function to fetch messages from server
function fetchMessages() {
    // Send GET request to server for list of messages
    fetch('/chats')
      .then((response) => response.json())
      .then((chats) => {
        // Clear messages list and add each chat message as a list item
        messagesList.innerHTML = '';
        chats.forEach((chat) => {
          const li = document.createElement('li');
          const aliasText = document.createElement('b');
          aliasText.textContent = chat.alias + ': ';
          const messageText = document.createTextNode(chat.message);
          li.appendChild(aliasText);
          li.appendChild(messageText);
          messagesList.appendChild(li);
        });
      })
      .catch((err) => console.error('Error fetching messages:', err));
  }
  
  // Use setInterval to fetch messages every 1 second
  setInterval(fetchMessages, 1000);

   