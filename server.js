const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 5711;  // TODO - must make Heroku friendly

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_FILE_NAME = './db/db.json';
const notesDataObj = require(DB_FILE_NAME);
console.log('required ' + DB_FILE_NAME + ' as notesDataObj in server');
console.log('notesDataObj on load = "' 
  + JSON.stringify(notesDataObj) + '"');

app.use(express.static('public')); console.log('public set in server');

// app.get('/api/db', (req, res) => {
//   console.log('get /api/db hit in server');
//   res.json(notesDataObj); 
// });

app.get('/notes', (req, res) => {
    console.log('get /notes hit in server');
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.get('/api/notes', (req, res) => {
  console.log('get /api/notes hit in server');
  res.status(200).json(notesDataObj);
})

app.post('/api/notes', (req, res) => {
  console.info('post /api/notes hit on server');
  console.info('req body at post = "' ,req.body ,'"');
  const { title, text } = req.body;
  if (title && text) {
    let id = uniqueId();  // TODO - must define function
    console.info('rand id = ' + id);
    let response = {
      title : req.body.title,
      text : req.body.text,
      id : id
    };
    appendAndSave(response);  // TODO - must define function
    res.status(201).json(response);
  } else {
    res.status(400).json('Request body must contain title and text');
  }
})

// app.put('/api/db', (req, res) => {
//   console.log('put /api/db it in server');
//   res.send("you hit the put endpoint for api/db!"); 

// });
// app.delete('/api/db', (req, res) => {
//   console.log('delete /api/db hit in server');
//   res.send("you hit the delete endpoint for api/db!"); 

// });
// app.post('/api/db', (req, res) => {
//   console.log('post /api/db hit in server');
//   res.send("you hit the post endpoint for api/db!"); 

// });

app.get('*', (req, res) => {
  console.log('get * hit in server');
  res.sendFile(path.join(__dirname, './public/index.html'));
});

console.log('server is listening at ' + PORT);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);

function uniqueId() {
  return Math.floor(Math.random()*1000000);  // TODO - temporary implementation
};

function appendAndSave(note) {
  // const notesDataObj = require(DB_FILE_NAME);
  notesDataObj.push(note);
  console.log('\n\nappended notesDataObj:');
  for (let i = 0; i < notesDataObj.length; i++) {
    console.log('note[' + i + ']:');
    console.log(JSON.stringify(notesDataObj[i]));
  }
  // TODO - still have to write to file
  fs.writeFile(DB_FILE_NAME, JSON.stringify(notesDataObj, null, 2), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${DB_FILE_NAME}`)
  );
};