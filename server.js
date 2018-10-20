const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')

// Get all art
app.get('/collection', (req, res) => {
  db.many('SELECT * from schilderijen limit 3')
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })
});

// Get specific art
app.get('/schilderij/:id', (req, res) => {
  let id = req.params.id;

  db.one('SELECT * from schilderijen where id = $1', [id])
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })
});

// Get all painters
app.get('/schilders', (req, res) => {
  db.many('SELECT * from schilder limit 15')
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })
});

// Get specific painter
app.get('/schilder/:name', (req,res) =>{
  let name = req.params.name.replace(/_/g, ' ');

  db.one('SELECT * from schilder where name = $1',[name])
  .then(function(data){
    res.send(data)
  })
  .catch(function(error){
    console.log('ERROR:', error)
  })
});

// Get all art from specific painter
app.get('/werken-van/:name', (req,res) =>{
  let name = req.params.name.replace(/_/g, ' ');

  db.many('SELECT * from schilderijen where principalmaker = $1 limit 15', [name])
    .then(function (data) {
      res.send(data)
    })
    .catch(function (error) {
      console.log('ERROR:', error)
    })
});

app.get('/test',(req,res)=>{
  db.many('select * from gebruiker limit 15')
  .then(function(data){
    res.send(data)
  })
  .catch(function(error){
    console.log('ERROR:',error)
  })
});

app.get('/test/:id',(req,res)=>{
  let id = req.params.id;
  db.one('select * from gebruiker where id = $1',[id])
  .then(function(data){
    res.send(data)
  })
  .catch(function(error){
    console.log('ERROR:',error)
  })
});
app.listen(port, () => console.log(`Server started on port ${port}`));