/**
 * Thomas Obrenovich
 * PA7: Translator Part 2
 * 
 * This takes the spanish.txt file and the german.txt file and creates a server that converts between
 * the three languages (spanish, german, and english). This server takes input directly into the text box, and does
 * the converting on the web page.
 * The translation is then presented to the user on the page. 
 * 
 * Input will be given on the webpage in the specified box.
 * 
 * --> This utlizes the line-reader node module along with express; both are required for the server to run <--
 * 
 */

const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = 80;

app.use(express.static('public_html'));

// Creates the server which takes in the address/string to translate specified at the top
app.get('/translate/:translation/:word', function (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    var url = req.url;
    var url_split = url.split('/');

    words = req.params.word;
    translation = req.params.translation;
    if (translation == 'e2s'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = enToSpThes[content_split[index].toLowerCase()];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }

        res.end(text);
    } 
    else if (translation == 'e2g'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = enToGerThes[content_split[index].toLowerCase()];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }
        res.end(text);
    } 
    else if (translation == 's2e'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = spToEnThes[content_split[index].toLowerCase()];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }
        res.end(text);
    } 
     else if (translation == 'g2e'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = gerToEnThes[content_split[index].toLowerCase()];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }
        res.end(text);
    } 
    else if (translation == 's2g'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = enToGerThes[spToEnThes[content_split[index].toLowerCase()]];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }
        res.end(text);
    } 
    else if (translation == 'g2s'){
        content_split = words.split(' ');
        var text = '';
        for (let index = 0; index < content_split.length; index++) {
            var addition = enToSpThes[gerToEnThes[content_split[index].toLowerCase()]];
            if (addition == undefined){
                text += '?';
            } else{
                text += addition;
            }
            text += ' ';
        }
        res.end(text);
    }
    else if (translation == 'none'){
        res.end(words);
    }
    else{
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
            var replaced = s1[1].replace(/[^A-Za-z0-9\s]/g, ".");
            var s2 = replaced.split('.');
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
            var replaced = s1[1].replace(/[^A-Za-z0-9\s]/g, ".");
            var s2 = replaced.split('.');
            enToGerThes[s1[0].toLowerCase()] = s2[0].toLowerCase();
            gerToEnThes[s2[0].toLowerCase()] = s1[0].toLowerCase();
        }
        if (last){
            console.log('done loading the file (german)');
            app.listen(port, () => {
                console.log(`App listening at http://localhost:${port}`);
               });
        }
    })
}

// Starts the Server
engToSpan();