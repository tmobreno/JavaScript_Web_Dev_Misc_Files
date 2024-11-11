/**
 * Thomas Obrenovich
 * PA6: Translator Part 1
 * 
 * This takes the spanish.txt file and the german.txt file and creates a server that converts between
 * the three languages (spanish, german, and english). The server runs based on the input given within the URL,
 * taking numerous word values in the form of "word+word+..."
 * The translation is presented to the user on the page. 
 * 
 * Example Input: http://127.0.0.1:3000/translate/e2s/lizard+dictator
 * 
 * --> This utlizes the line-reader node module and is required for the server to run <--
 * 
 */

const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

// Creates the server which takes in the address/string to translate specified at the top
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    var url = req.url;
    var url_split = url.split('/');
    if (url_split[1] == 'favicon.ico'){
        res.end();
    }
    else if(url_split[1] == 'translate'){
        if (url_split[2] == 'e2s'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += enToSpThes[content_split[index].toLowerCase()];
                text += ' ';
            }
            res.end(text);
        } 
        else if (url_split[2] == 'e2g'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += enToGerThes[content_split[index].toLowerCase()];
                text += ' ';
            }
            res.end(text);
        } 
        else if (url_split[2] == 's2e'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += spToEnThes[content_split[index].toLowerCase()];
                text += ' ';
            }
            res.end(text);
        } 
        else if (url_split[2] == 'g2e'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += gerToEnThes[content_split[index].toLowerCase()];
                text += ' ';
            }
            res.end(text);
        } 
        else if (url_split[2] == 's2g'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += enToGerThes[spToEnThes[content_split[index].toLowerCase()]];
                text += ' ';
            }
            res.end(text);
        } 
        else if (url_split[2] == 'g2s'){
            content_split = url_split[3].split('+');
            var text = '';
            for (let index = 0; index < content_split.length; index++) {
                text += enToSpThes[gerToEnThes[content_split[index].toLowerCase()]];
                text += ' ';
            }
            res.end(text);
        }
        else{
            res.end("OK");
        }
    }
    else {
        res.end("OK");
    }
});

// Creates four Thesaurus' to perform the translations
enToSpThes = {};
enToGerThes = {};
spToEnThes = {};
gerToEnThes = {};

// Reading the Thesaurus' requires the line-reader module
var lineReader = require('line-reader');

// Goes from English to Spanish
function engToSpan() {
    lineReader.eachLine('./Spanish.txt', function(line, last) {
        if(line[0] != '#'){
            var s1 = line.split('\t');
            var replaced = s1[1].replace(/[^A-Za-z0-9]/g, " ");
            var s2 = replaced.split(' ');
            enToSpThes[s1[0].toLowerCase()] = s2[0].toLowerCase();
            spToEnThes[s2[0].toLowerCase()] = s1[0].toLowerCase();
        }
        if (last){
            console.log('done loading the file (spanish)');
            engToGerm();
        }
    })
}

// Goes from English to German
function engToGerm() {
    lineReader.eachLine('./German.txt', function(line, last) {
        if(line[0] != '#'){
            var s1 = line.split('\t');
            var replaced = s1[1].replace(/[^A-Za-z0-9]/g, " ");
            var s2 = replaced.split(' ');
            enToGerThes[s1[0].toLowerCase()] = s2[0].toLowerCase();
            gerToEnThes[s2[0].toLowerCase()] = s1[0].toLowerCase();
        }
        if (last){
            console.log('done loading the file (german)');
            server.listen(port, hostname, () => {
                console.log(`Server running at http://${hostname}:${port}/`);
               });
        }
    })
}

// Starts the Server
engToSpan();