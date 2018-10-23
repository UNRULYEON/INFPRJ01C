const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String,
    collection: [Collection]
    paintingByID(id: String!): [Painting]
    painters: [Painter]
    painterByID(id: String!): [Painter]
    workByPainter(id: String!): [Painting]
    me: User,
    status: Int
  },
  type Mutation {
    signup(name: String!, surname: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
  },
  type Collection {
    id: ID,
    id_number: Int,
    title: String,
    releasedate: Int,
    period: Int,
    description: String,
    physicalmedium: String,
    amountofpaintings: Int,
    src: String,
    bigsrc: String,
    plaquedescriptiondutch: String,
    principalmakersproductionplaces: String,
    width: Int,
    height: Int,
    principalmaker: String
  },
  type Painting{
    id: ID,
    id_number: Int,
    title: String,
    releasedate: Int,
    period: Int,
    description: String,
    physicalmedium: String,
    amountofpaintings: Int,
    src: String,
    bigsrc: String,
    plaquedescriptiondutch: String,
    principalmakersproductionplaces: String,
    width: Int,
    height: Int,
    principalmaker: String
  },
  type Painter{
    name: String,
    id: Int,
    city: String,
    dateofbirth: String,
    dateofdeath: String,
    placeofbirth: String,
    occupation: String,
    nationality: String,
    headerimage: String,
    thumbnail: String,
    description: String
  },
  type User {
    id: String,
    name: String,
    surname: String,
    email: String,
    password: String
  }
`)

module.exports = {
  schema
}