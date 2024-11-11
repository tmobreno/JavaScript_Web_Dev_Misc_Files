/**
 * Thomas Obrenovich
 * PA10: Ostaa pt2
 * 
 * Runs the client side for the home page, communicating with the server.js file in order to manage user searches as well
 * as giving the user the ability to view their own listings as well as their purchases.
 * 
 * This is all displayed alongside the html so that the information from the database is properly represented to the user.
 * 
 */

let create = document.getElementById('createAListing');
let searchListings = document.getElementById('searchListings');
let listingDesc = document.getElementById('listingDesc');
let viewYourListings = document.getElementById('viewYourListings');
let viewYourPurchases = document.getElementById('viewYourPurchases');

if(document.cookie == ""){
  window.location.href = "/index.html";
}
const cookie = document.cookie;
const jsonValue = JSON.parse(decodeURIComponent(cookie).split('login=')[1].replace(/^j:/, ''));
const username = jsonValue.username;

let header = document.getElementById('header');
header.innerHTML = 'Welcome Back ' + username;

create.addEventListener('click', () => {window.location.href = "/create.html";});
searchListings.addEventListener('click', function() {
    const keyword = listingDesc.value.trim();
    fetchItems('search', 'items', keyword);
  });
viewYourListings.addEventListener('click', function(){
  fetchItems('get', 'listings', username)});
viewYourPurchases.addEventListener('click', function(){
  fetchItems('get', 'purchases', username)});

// Fetch items based on the varying parameters of which button is pressed
function fetchItems(type, search, keyword) {
  const resultsDiv = document.getElementById('searchResults');
  resultsDiv.innerHTML = ''; // Clear all search results
  fetch(`/${type}/${search}/${keyword}`)
    .then((response) => response.json())
    .then((items) => {
      items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        const title = document.createElement('h3');
        title.textContent = item.title;
        const description = document.createElement('p');
        description.textContent = item.description;
        const image = document.createElement('p');
        image.textContent = item.image;
        const price = document.createElement('p');
        price.textContent = `Price: ${item.price}`;
        itemDiv.appendChild(title);
        itemDiv.appendChild(description);
        itemDiv.appendChild(image);
        itemDiv.appendChild(price);
        const status = document.createElement('p');
        const buyBtn = document.createElement('button');
        if (item.status != 'SOLD') {
          buyBtn.textContent = 'Buy Now!';
          buyBtn.addEventListener('click', () => {
            purchaseItem(item.title, username);
            buyBtn.disabled = true;
            status.textContent = 'SOLD';
          });
          itemDiv.appendChild(buyBtn);
        } else {
          status.textContent = 'SOLD';
        }
        itemDiv.appendChild(status);
        itemDiv.className = "newItem";
        resultsDiv.appendChild(itemDiv);
      });
    })
    .catch((err) => console.error('Error Caught', err));
}

// ALlows the user to purchase an item
function purchaseItem(itemId, keyword) {
  fetch(`/purchase/${itemId}/${keyword}`, { method: 'POST' })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log('Purchase successful');
      } else {
        console.error('Purchase failed');
      }
    })
    .catch((err) => console.error('Error Caught', err));
}