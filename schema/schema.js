const { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    collection: [Collection]
    collectionSearch: [Collection]
    paintingOrderedByPagination(page: Int!, amount: Int): CollectionWithTotal
    paintingByID(id: String!): [Painting]
    workByPainter(id: String!): [Painting]
    filterbyperiod(period: Int!): [Painting]
    filterbypriceasc: [Painting]
    filterbypricedesc: [Painting]
    filterbytitleasc: [Painting]
    filterbytitledesc: [Painting]
    paintersAll: [Painter]
    paintersAdmin(page: Int!, amount: Int): PainterWithTotal
    painters: [Painter]
    painterByID(id: String!): [Painter]
    PaintingsByPainter(id: String!): [ret]
    checkUser(mail: String!): Boolean!
    me: User
    selectAllUsers(page: Int!, amount: Int!): TotalUsers
    selectUserById(id: Int!): User
    faq: [FAQ]
    faqId: FAQ
    status: Int 
    papatabel: [PapaGet]
    orderListSelect(buyerId: Int!): [Orders]
    selectShoppingCart(userId: Int!): [Cart]
    searchbar(query: String!, page: Int!, amount: Int): searchResult
    wishlistSelect(userId: Int!): [wishlist]
    filterPaintings(num: Int, prodplace: String, physical: String, pricemin: Int, pricemax: Int, order: String): [Painting]
    filterPaintingsPaginated(title: String, dateStart: Int, dateEnd: Int, period: Int, physicalmedium: String, amountofpaintings: Int, principalmakerprodplace: String, principalmaker: String, pricemin: Int, pricemax: Int, amountwatched: Int): String
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
    addProduct(id: String!, title: String!, releasedate: Int!, period: Int!, description: String!, physicalmedium: String!, amountofpaintings: Int!, src: String!, bigsrc: String!,prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean!,painterId: Int!): String!
    alterProduct(id_number: Int!, id: String!, title: String!, releasedate: Int!, period: Int! description: String!, physicalmedium: String!, amountofpaintings: Int!, src: String!, bigsrc: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean!, amountwatched: String!): String
    deleteProduct(id: Int!): String
    addPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String!, thumbnail: String!, description: String!): String
    alterPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String!, thumbnail: String!, description: String!, amountwatched: String!): String
    deltePainter(name: String!): String
    createBabyTabel(tabelnaam: String!, foreignkey: [RefBaby!], type: String!): String
    addToBabyTabel(id: Int!, foreignkey: [RefBaby!]): String
    removeBabyTabel(id: Int!): String
    shoppingCartInsert(gebruikerId: Int!, items: String!, time: String!): String
    orderListInsert(gebruikerId: Int, items: [PaintRef!], purchaseDate: String!): String
    rentalListInsert(gebruikerId: Int!, items : [PaintRefRent!], purchaseDate: String!): String
    orderListUpdate(id: Int!, buyerId: Int!, newStatus: String!): String
    WishlistInsert(gebruikerId: Int!, items: String!, time: String!): String
    faqCreate(question: String!, answer: String!): String
    faqUpdate(question: String!, answer: String!, id: Int!): String
    faqDelete(id: Int!): String!
  },
  input PaintRef{foreignkey: Int!,},
  input PaintRefRent{
    foreignkey: Int!, 
    startDate: String!, 
    stopDate: String!},
  input RefBaby{foreignkey: Int!},
  type PapaGet{
    id: Int,
    naam: String,
    type: String
  },
  type Cart{
    id: Int,
    gebruikerid: Int,
    items: String,
    timestamp: String
  }
  type Orders{
    id: Int,
    buyerid: Int,
    items: Int,
    purchasedate: String,
    status: String
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
  type PainterWithTotal{
    total: Int,
    painterpagination: [Painter]
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
    city: String,
    postalcode: String,
    password: String,
    aanhef: String,
    housenumber: String,
    admin: Boolean,
    paymentmethod: String
  }, 
  type TotalUsers{
    total: Int,
    totaluser: [User]
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
  },
  type wishlist{
    id: Int,
    gebruikerid: Int,
    items: String,
    timestamp: String
  }
`)

module.exports = {
  schema
}