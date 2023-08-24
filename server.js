const express = require('express');
const path = require('path');
const app = express();
const PORT = 5711;  // TODO - must make Heroku friendly

const repos = require("./db/db.json")
console.log('required ./db/db/json as repos in server - line 7');

app.use(express.static('public')); console.log('public set in server - line 9');

app.get('/api/db', (req, res) => {
  console.log('get /api/db hit in server - line 12');
  res.json(repos); 

});

app.get('/notes', (req, res) => {
    console.log('get /notes hit in server - line 18');
    res.sendFile(path.join(__dirname, './public/notes.html'));
    // Yes, the above works, now .... TODO added evening 8/22
})

app.get('/api/notes', (req, res) => {
  console.log('get /api/notes hit in server - line 24');
  res.sendFile(path.join(__dirname, './public/notes.html'));
  // Yes, the above works, now .... TODO added morning 8/23
})

app.put('/api/db', (req, res) => {
  console.log('put /api/db it in server line - 30');
  res.send("you hit the put endpoint for api/db!"); 

});
app.delete('/api/db', (req, res) => {
  console.log('delete /api/db hit inserver - line 35');
  res.send("you hit the delete endpoint for api/db!"); 

});
app.post('/api/db', (req, res) => {
  console.log('post /api/db hit in server - line 40');
  res.send("you hit the post endpoint for api/db!"); 

});
console.log('server is listening at ' + PORT);
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);