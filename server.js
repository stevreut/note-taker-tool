const express = require('express');
const path = require('path');
const app = express();
const PORT = 5711;  // TODO - must make Heroku friendly

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const notesDataObj = require("./db/db.json")
console.log('required ./db/db/json as notesDataObj in server - line 7');
console.log('notesDataObj on load = "' 
  + JSON.stringify(notesDataObj) + '"');

app.use(express.static('public')); console.log('public set in server - line 9');

// app.get('/api/db', (req, res) => {
//   console.log('get /api/db hit in server - line 12');
//   res.json(notesDataObj); 
// });

app.get('/notes', (req, res) => {
    console.log('get /notes hit in server - line 18');
    res.sendFile(path.join(__dirname, './public/notes.html'));
    // Yes, the above works, now .... TODO added evening 8/22
})

app.get('/api/notes', (req, res) => {
  console.log('get /api/notes hit in server - line 24');
  res.status(200).json(notesDataObj);
})

app.post('/api/notes', (req, res) => {
  console.info('post /api/notes hit on server - line 31');
  // TODO
  // Prepare a response object to send back to the client
  // let response;
  // console.log ('text = ' + req.body.text);

  // Check if there is anything in the response body
  console.info('req body at post = "' ,req.body ,'"');
  if (req.body && req.body.title && req.body.text) {
    let iid = Math.floor(Math.random()*100000);  // TODO
    console.info('rand id = ' + iid);
    let response = {
      title : req.body.title,
      text : req.body.text,
      id : iid  // TODO - fix this with something more appropriate later
      // status: 'success',
      // data: req.body,
    };
    res.status(201).json(response);
  } else {
    res.status(400).json('Request body must contain title and text');
  }
})

// app.put('/api/db', (req, res) => {
//   console.log('put /api/db it in server line - 30');
//   res.send("you hit the put endpoint for api/db!"); 

// });
// app.delete('/api/db', (req, res) => {
//   console.log('delete /api/db hit inserver - line 35');
//   res.send("you hit the delete endpoint for api/db!"); 

// });
// app.post('/api/db', (req, res) => {
//   console.log('post /api/db hit in server - line 40');
//   res.send("you hit the post endpoint for api/db!"); 

// });

app.get('*', (req, res) => {
  console.log('get * hit in server - line 46');
  res.sendFile(path.join(__dirname, './public/index.html'));
});

console.log('server is listening at ' + PORT);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);