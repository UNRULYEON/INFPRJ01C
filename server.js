const express = require('express');
const app = express();
const port = 3001;

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')

app.get('/collection', (req, res) => {
  db.many('SELECT * from collectionDetails limit 100')
  .then(function (data) {
    res.send(data)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
});

app.get('/schilderij/:id', (req, res) => {

  let id = req.params.id;

  db.one('SELECT * from collectionDetails where id = $1', [id])
  .then(function (data) {
    res.send(data)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  })
});

app.listen(port, () => console.log(`Server started on port ${port}`));