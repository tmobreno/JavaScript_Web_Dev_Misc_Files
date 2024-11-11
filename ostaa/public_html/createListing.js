/**
 * Thomas Obrenovich
 * PA10: Ostaa pt2
 * 
 * Runs the client side for the item creation page, allowing for new items to be added as well as a button to return to the home
 * page for easier site navigation.
 * 
 */

let title1 = document.getElementById('Title');
let descr1 = document.getElementById('Description');
let image1 = document.getElementById('Image');
let price1 = document.getElementById('Price');
let stat1 = document.getElementById('Stat');
let addItemButton = document.getElementById('addItem');
let returnHome = document.getElementById('returnHome');

if(document.cookie == ""){
  window.location.href = "/index.html";
}
const cookie = document.cookie;
const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
const username = jsonValue.username;

addItemButton.addEventListener('click', createItem);
returnHome.addEventListener('click', () => {window.location.href = "/home.html";});

// Function to send message
function createItem() {
    const title = title1.value.trim();
    const descr = descr1.value.trim();
    const image = image1.value.trim();
    const price = price1.value.trim();
    const stat = stat1.value.trim();
    fetch('/add/item/' + username, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, descr, image, price, stat })
    })
      .catch((err) => console.error('Error Caught', err));
  }
