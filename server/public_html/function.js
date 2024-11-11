/**
 * Thomas Obrenovich
 * PA7: Translator Part 2
 * 
 * Sets up a request from the server which is then able to update the response text on the page.
 * It takes in the users input in order to modify correctly translate the text.
 * 
 */

let textToTranslate = document.getElementById('textToTranslate');
let translation = document.getElementById('translation');

let startTrans = document.getElementById('startTrans');
let endTrans = document.getElementById('endTrans');

let typeTrans = "none";

// Event listeners for the objects on the page
textToTranslate.addEventListener('input', function getText(){
    setupRequest();
});

startTrans.addEventListener('input', function getText(){
    checkTranslation();
});

endTrans.addEventListener('input', function getText(){
    checkTranslation();
});

// Sets up the request when the user provides input that corresponds to changes in translation
function setupRequest() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
        alert('Error!');
        return false;
    }

    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                translation.innerHTML = httpRequest.responseText;
                } else { translation.innerHTML = ""; }
        }
    }
    
    let url = 'http://localhost:80/translate/' + typeTrans + '/' + textToTranslate.value;
    httpRequest.open('GET', url);
    httpRequest.send();
}

// Checks and updates which type of translation the user is performing
function checkTranslation(){
    if(startTrans.value == "English" && endTrans.value == "Spanish"){
        typeTrans = "e2s";
        setupRequest();
    }
    else if(startTrans.value == "Spanish" && endTrans.value == "English"){
        typeTrans = "s2e";
        setupRequest();
    }
    else if(startTrans.value == "English" && endTrans.value == "German"){
        typeTrans = "e2g";
        setupRequest();
    }
    else if(startTrans.value == "Spanish" && endTrans.value == "German"){
        typeTrans = "s2g";
        setupRequest();
    }
    else if(startTrans.value == "German" && endTrans.value == "Spanish"){
        typeTrans = "g2s";
        setupRequest();
    }
    else if(startTrans.value == "German" && endTrans.value == "English"){
        typeTrans = "g2e";
        setupRequest();
    } else{
        typeTrans = "none";
        setupRequest();
    }
}
   