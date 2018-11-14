const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    collection: [Collection]
    collectionSearch: [Collection]
    paintingOrderedByPagination(page: Int!): CollectionWithTotal
    paintingByID(id: String!): [Painting]
    paintersAll: [Painter]
    PaintingsByPainter(id: String!): [ret]
    painters: [Painter]
    painterByID(id: String!): [Painter]
    workByPainter(id: String!): [Painting]
    me: User
    faq: [FAQ]
    status: Int
  },
  type Mutation {
    signup(name: String!, surname: String!, mail: String!, password: String!, aanhef: String, adres: String, housenumber: String, city: String, 
      postalcode: String): UserWithToken!
    login(email: String!, password: String!): UserWithToken!
    merge(id_number: Int!, id: Int!): String
    merging: String
    addUser(name: String!, surname: String!, mail: String!, password: String!, aanhef: String!, adres: String, city: String, postalcode: String, housenumber: String): String
    alterUser(id: Int!, name: String!, surname: String!, aanhef: String!, mail: String!, password: String!, adres: String!, city: String!, postalcode: String!, housenumber: String!): String!
    alterProduct(id_number: Int!, id: String!, title: String!, releasedate: String!, period: String! description: String!, physicalmedium: String!, amountofpaintings: Int!, src: String!, bigsrc: String!, plaguedescdutch: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!): String
  },
  type ret{
    id_number: Int,
    title: String,
    principalmaker: String,
    name: String,
    id: Int,
  }
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
    principalmaker: String,
    price: Int,
  },
  type CollectionWithTotal{
    total: Int,
    collection: [Collection]
  }
  type Painting{
    id: String,
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
    id: Int,
    name: String,
    surname: String,
    email: String,
    address: String,
    housenumber: String,
    city: String,
    postalcode: String,
    password: String,
    aanhef: String    
  },
  type UserWithToken { 
    id: Int,
    name: String,
    surname: String,
    email: String,
    address: String,
    housenumber: String,
    city: String,
    postalcode: String,
    password: String,
    aanhef: String,
    token: String    
  },
  type FAQ{
    id: Int,
    title: String,
    body: String
  }
`)

module.exports = {
  schema
}