/*
Name: Thomas Obrenovich
Description: This file performs the numerous functions of the site, including the top cipher (caeser) and the bottom cipher (square). This allows for both of the ciphers to be performed in real time
on the website. This file is linked to the script portion of the html page code.
*/

let text;
let textarea = document.getElementById('sentence');
let topText = document.getElementById('top');
let botText = document.getElementById('bot');
let num = document.getElementById('num');
let slider = document.getElementById("cipher");
let bottomCipher = [];

// Input for the text typed into the page
textarea.addEventListener('input', function getText() {
  num.innerHTML = slider.value;
  text = textarea.value;
  topText.innerHTML = topCipher(text, slider.value);
  botText.innerHTML = botCipher(text);
});

// Input for the slider which affects the slider value of the caeser cipher.
slider.addEventListener('input', function adjustSlider() {
  num.innerHTML = slider.value;
  topText.innerHTML = topCipher(text, slider.value);
});

// Converts the text through the caeser cipher using the slider value for offset
function topCipher(str, sliderValue){
    var top_text = str.toLowerCase();
    var top_letters = top_text.split("");
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    var current_text="", this_x = "";
    sliderValue = parseInt(sliderValue);
    for (x in top_letters) {
        if (alphabet.indexOf(top_letters[x]) == -1){
          current_text = current_text + top_letters[x];
        }
        else if (sliderValue > 0) {
          this_x = alphabet[(alphabet.indexOf(top_letters[x]) + sliderValue) % alphabet.length];
          current_text = current_text + this_x;
        } else {
          this_x = alphabet[(alphabet.indexOf(top_letters[x]) + (26 - sliderValue)) % alphabet.length];
          current_text = current_text + this_x;
        }
    }
    return current_text;
}

// Converts the text through the square cipher using the randomly generated square of letters
function botCipher(str){
  var top_letters = str.toLowerCase().split("");
  var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  var fintext="", this_x = "";
  for (x in top_letters){
    this_x = bottomCipher[alphabet.indexOf(top_letters[x])];
    if (this_x === undefined){
      fintext = fintext + top_letters[x];
    } else {
      fintext = fintext + this_x;
    }
  }
  return fintext;
}

var update = document.getElementById('update');

update.addEventListener('click', UpdateTable);

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Updates the square table to generate a new random value of letters, usable by the bottom square cipher.
function UpdateTable() {
    bottomCipher = [];
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y']
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            tmp = 'cell' + i + j;
		numb = randomNumber(0, alphabet.length);
            document.getElementById(tmp).innerHTML = alphabet[numb];
		bottomCipher.push(alphabet[numb]);
		alphabet.splice(numb, 1);
        }
    }
    botText.innerHTML = botCipher(text);
}