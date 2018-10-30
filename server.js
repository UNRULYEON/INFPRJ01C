const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors')

const { schema } = require('./schema/schema')
const { root } = require('./query/query')

const bodyParser = require('body-parser');
const jwt = require('express-jwt')

const app = express();
const port = 3001;

//#region Get Data
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
//#endregion

//#region Post data
// Signup new user
app.post('/user/signup', (req, res) => {
  var body = req.body

  var hash = bcrypt.hashSync(body.password.trim(), 10)
  var user = new user({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: hash
  })

  db.one()
})
//#endregion


//#region Testing
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

//#endregion
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const auth = jwt({
  secret: "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
  credentialsRequired: false
})

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(port, () => console.log(`Server started on port ${port}`));