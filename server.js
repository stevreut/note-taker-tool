const express = require('express');
const path = require('path');
const app = express();
const PORT = 5711;  // TODO

const repos = require("./db/db.json")


app.use(express.static('public'));

app.get('/api/db', (req, res) => {

  res.json(repos); 

});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
    // Yes, the above works, now .... TODO added evening 8/22
})

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
  // Yes, the above works, now .... TODO added morning 8/23
})

app.put('/api/db', (req, res) => {

  res.send("you hit the put endpoint for api/db!"); 

});
app.delete('/api/db', (req, res) => {

  res.send("you hit the delete endpoint for api/db!"); 

});
app.post('/api/db', (req, res) => {
  
  res.send("you hit the post endpoint for api/db!"); 

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);