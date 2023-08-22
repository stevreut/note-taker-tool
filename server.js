const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const repos = require("./db/db.json")


app.use(express.static('public'));

app.get('/api/db', (req, res) => {

  res.json(repos); 

});
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