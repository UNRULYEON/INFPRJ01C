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
    checkUser(mail: String!): Boolean!
    me: User
    filterbyperiod(period: Int!): [Painting]
    filterbypriceasc: [Painting]
    filterbypricedesc: [Painting]
    filterbytitleasc: [Painting]
    filterbytitledesc: [Painting]
    selectsallusers: [User]
    faq: [FAQ]
    status: Int 
    papatabel: [PapaGet]
    orderListSelect(buyerId: Int!): [Orders]
    searchbar(query: String!, page: Int!): searchResult
  },
  type Mutation {
    signup(name: String!, surname: String!, mail: String!, password: String!, aanhef: String, adres: String, housenumber: String, city: String, 
      postalcode: String, paymentmethod: String): UserWithToken!
    login(email: String!, password: String!): UserWithToken!
    merge(id_number: Int!, id: Int!): String
    merging: String
    addUser(name: String!, surname: String!, mail: String!, password: String!, aanhef: String!, adres: String, city: String, postalcode: String, housenumber: String, paymentmethod: String): String!
    alterUser(id: Int!, name: String!, surname: String!, aanhef: String!, mail: String!, password: String!, adres: String!, city: String!, postalcode: String!, housenumber: String!, paymentmethod: String!): String!
    deleteUser(id: Int!): String
    addProduct(id: String!, title: String!, releasedate: Int!, period: Int!, description: String!, physicalmedium: String!, amountofpaintings: Int!, src: String!, bigsrc: String!, plaguedescdutch: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean!): String!
    alterProduct(id_number: Int!, id: String!, title: String!, releasedate: Int!, period: Int! description: String!, physicalmedium: String!, amountofpaintings: Int!, src: String!, bigsrc: String!, plaguedescdutch: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean!): String
    deleteProduct(id: Int!): String
    addPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String!, thumbnail: String!, description: String!): String
    createBabyTabel(tabelnaam: String!, foreignkey: [RefBaby!], type: String!): String
    addToBabyTabel(id: Int!, foreignkey: [RefBaby!]): String
    removeBabyTabel(id: Int!): String
    shoppingCartInsert(gebruikerId: Int!, items: String!, time: String!): String
    orderListInsert(gebruikerId: Int, items: [PaintRef!], purchaseDate: String!): String
    rentalListInsert(gebruikerId: Int!, items : [PaintRef!], purchaseDate: String!, rentStart: String!, rentStop: String!): String
  },
  input PaintRef{foreignkey: Int!},
  input RefBaby{foreignkey: Int!},
  type PapaGet{
    id: Int,
    naam: String,
    type: String
  },
  type Orders{
    id: Int,
    buyerid: Int,
    items: Int,
    purchasedate: String
  },
  type ret{
    id_number: Int,
    title: String,
    principalmaker: String,
    name: String,
    src: String,
    width: Int,
    height: Int,
    price: Int
  },
  type searchResult {
    paintings: [Painting],
    total: Int
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
    principalmaker: String,
    price: Int,
  },
  type CollectionWithTotal{
    total: Int,
    collection: [Collection]
  },
  type Painting{
    id: String,
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
    painter: String
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
    mail: String,
    adres: String,
    housenumber: String,
    city: String,
    postalcode: String,
    paymentmethod: String,
    password: String,
    aanhef: String,
    admin: Boolean
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
    paymentmethod: String,
    token: String,
    admin: Boolean
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