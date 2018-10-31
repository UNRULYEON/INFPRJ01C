const express = require('express');
const graphqlHTTP = require('express-graphql');
const cors = require('cors')

const { schema } = require('./schema/schema')
const { root } = require('./query/query')

const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors())
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(port, () => console.log(`Server started on port ${port}`));