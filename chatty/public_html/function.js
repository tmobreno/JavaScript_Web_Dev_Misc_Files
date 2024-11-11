/**
 * Thomas Obrenovich
 * PA8: Chatty
 * 
 * The client side of the code, which manages the requests that the user makes to the server, including sending and fetching messages.
 * This is displayed back to the user with the css and html for the page.
 * 
 * The site is updated using the set interval function.
 * 
 */

let messagesList = document.getElementById('chatContent');
let aliasInput = document.getElementById('Alias');
let messageInput = document.getElementById('Message');
let sendButton = document.getElementById('Submit');

sendButton.addEventListener('click', sendMessage);

// Function to send message
function sendMessage() {
    const alias = aliasInput.value.trim();
    const message = messageInput.value.trim();
    fetch('/chats/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias, message })
    })
      .then(() => {
        // Resets the message input to take further inputs
        messageInput.value = '';
      })
      .catch((err) => console.error('Error Caught', err));
}
  
// Function to fetch the messages
function fetchMessages() {
    fetch('/chats')
      .then((response) => response.json())
      .then((chats) => {
        messagesList.innerHTML = '';
        // For each message found, creates the chat element as specified with formatting and places it within the messages list
        chats.forEach((chat) => {
          const p = document.createElement('p');
          const aliasText = document.createElement('b');
          aliasText.textContent = chat.alias + ': ';
          const messageText = document.createTextNode(chat.message);
          p.appendChild(aliasText);
          p.appendChild(messageText);
          messagesList.appendChild(p);
        });
      })
      .catch((err) => console.error('Error Caught', err));
  }
  
  // Sets the interval to fetch messages
  setInterval(fetchMessages, 1000);

   