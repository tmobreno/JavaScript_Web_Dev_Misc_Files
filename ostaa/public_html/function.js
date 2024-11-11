/**
 * Thomas Obrenovich
 * PA10: Ostaa pt2
 * 
 * Runs the client side of the server for the login page, allowing the user to create a profile
 * and log themselves in. It communicates with the login features of the server.js file, dealing
 * specifically with user identification.
 * 
 */

let username = document.getElementById('Username');
let password = document.getElementById('Password');
let addUserButton = document.getElementById('addUser');

let loginButton = document.getElementById('login');
let Lusername = document.getElementById('SigUsername');
let Lpassword = document.getElementById('SigPassword');

addUserButton.addEventListener('click', createUser);
loginButton.addEventListener('click', loginUser);

// Function to send message
function createUser() {
    const user = username.value.trim();
    const pass = password.value.trim();
    fetch('/add/user/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass })
    })
      .catch((err) => console.error('Error Caught', err));
}

// Login the User
function loginUser(){
  const user = Lusername.value.trim();
  const pass = Lpassword.value.trim();
  fetch('/account/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass })
  })
  .then(response => {
    if (response.ok) {
      response.json().then(data => {
        if (data.success) {
          window.location.href = "/home.html";
        } else {
          alert("Incorrect Login Information");
        }
      });
    } else {
      alert("Error");
    }
  })
}
   