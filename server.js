const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
// SECOND "PORT" changed to UPPER CASE 8/25 1:24 p.m.
const PORT = process.env.PORT || 5711;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE_NAME = './db/db.json';  // Location of persisted notes
const notesDataObj = require(DB_FILE_NAME);

app.use(express.static('public'));

app.get('/notes', (req, res) => {
  // Go to notes page from landing page
  res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
  // respond back with JSON array of notes
  res.status(200).json(notesDataObj);
})

app.post('/api/notes', (req, res) => {
  // Provided title and text are present, appends a new note
  // with generated unique ID to the internal array and also 
  // persists that augmented array to file
  // before responding with the new note (including ID)
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
  // Handles a delete request by assuming the :id parameter has a value matching the
  // unique id attribute of one of the notes.  The array of notes is examined to find
  // a match, deletes the element that matches (based on id), updates the DB file
  // accordingly and responds back with the note object that was deleted.
  const idToDelete = req.params.id;
  for (let i=0; i<notesDataObj.length; i++) {
    if (notesDataObj[i].id === idToDelete) {
      let deletedNote = notesDataObj.splice(i,1);  // delete element at index i
      writeNotes();
      res.status(200).json(deletedNote);  // TODO - check if 200 is correct
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
  return uuid;
};

function appendAndSave(note) {
  notesDataObj.push(note);
  writeNotes();
};

function writeNotes() {
  fs.writeFile(DB_FILE_NAME, JSON.stringify(notesDataObj, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${DB_FILE_NAME}`)
  );
}