const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5711;  // TODO - must make Heroku friendly

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE_NAME = './db/db.json';
const notesDataObj = require(DB_FILE_NAME);

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
  res.status(200).json(notesDataObj);
})

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    let id = uniqueId();
    let response = {
      title : req.body.title,
      text : req.body.text,
      id : id
    };
    appendAndSave(response);
    res.status(201).json(response);
  } else {
    res.status(400).json('Request body must contain title and text');
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const idToDelete = req.params.id;
  for (let i=0; i<notesDataObj.length; i++) {
    if (notesDataObj[i].id === idToDelete) {
      let deletedNote = notesDataObj.splice(i,1);  // delete element at index i
      writeNotes();
      res.status(200).json(deleteNote);  // TODO - check if 200 is correct
      return;
    }
  }
  res.status(500).json('no id ' + idToDelete + ' found to delete');  // TODO - check if 500 is correct
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

console.log('server will be listening at ' + PORT);
app.listen(PORT, () =>
  console.log(`note-taker app server is listening at ${PORT}`)
);

function uniqueId() {
  // Generates a random (and VERY likely unique) STRING
  // of 4 hexadecimal digits
  //
  // Routine borrowed and minimally 
  // modified from uuid.js of unit-11 activity 19
  let uuid =
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  console.log('uuid generated = "' + uuid + '"');
  return uuid;
};

function appendAndSave(note) {
  notesDataObj.push(note);
  console.log('\n\nappended notesDataObj:');
  for (let i = 0; i < notesDataObj.length; i++) {
    console.log('note[' + i + ']:');
    console.log(JSON.stringify(notesDataObj[i]));
  }
  writeNotes();
};

function writeNotes() {
  fs.writeFile(DB_FILE_NAME, JSON.stringify(notesDataObj, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${DB_FILE_NAME}`)
  );
}