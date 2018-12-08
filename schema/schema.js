const { buildSchema } = require('graphql');

var schema = buildSchema(`
  """ 
  Query is a GET statement, and can only retrieve data from the DataBase.
  """
  type Query {
    """
    Hello is a simple test to see if the server is running.
    """
    hello: String
    """
    Collection returns an array of paintings ordered by number, with a limit of 15.
    """
    collection: [Collection]
    """
    CollectionSearch returns an array of paintings ordered by number.
    """
    collectionSearch: [Collection]
    """
    PaintingOrderedByPagination takes the page and the amount of items that should be shown per page, and returns an array of paintings.
    """
    paintingOrderedByPagination(page: Int!, amount: Int): CollectionWithTotal
    """
    
    """
    paintingByID(id: String!): [Painting]
    workByPainter(id: String!): [Painting]
    filterbyperiod(period: Int!): [Painting]
    filterbypriceasc: [Painting]
    filterbypricedesc: [Painting]
    filterbytitleasc: [Painting]
    filterbytitledesc: [Painting]
    paintersAll: [Painter]
    paintersAdmin(page: Int!, amount: Int): PainterWithTotal
    painterByID(id: String!): [Painter]
    PaintingsByPainter(id: String!): [ret]
    checkUser(mail: String!): Boolean!
    me: User
    selectAllUsers(page: Int!, amount: Int!): TotalUsers
    selectUserById(id: Int!): User
    faq: [FAQ]
    faqId(id: Int!): FAQ
    status: Int 
    papatabel: [PapaGet]
    orderListSelect(buyerId: Int!): [Orders]
    selectShoppingCart(userId: Int!): [Cart]
    searchbar(query: String!, page: Int!, amount: Int): searchResult
    searchpainter(query: String!, page: Int!, amount: Int): Paintersearch
    wishlistSelect(userId: Int!): [wishlist]
    filterPaintings(num: Int, prodplace: String, physical: String, pricemin: Int, pricemax: Int, order: String): [Painting]
    filterPaintingsPaginated(title: String, dateStart: Int, dateEnd: Int, period: Int, physicalmedium: String, amountofpaintings: Int, principalmakerprodplace: String, principalmaker: String, pricemin: Int, pricemax: Int, amountwatched: Int): String
  },
  """ 
  Mutation is a Put/Post statement, and can create or alter data in the DataBase.
  """
  type Mutation {
    """ 
    signup is used to create an account for a visitor of the website.
    """
    signup(name: String!, surname: String!, mail: String!, password: String!, aanhef: String, adres: String, housenumber: String, city: String, postalcode: String, paymentmethod: String): UserWithToken!
    """
    login is used for a registered user to log into his/her account.
    """
    login(email: String!, password: String!): UserWithToken!
    merge(id_number: Int!, id: Int!): String
    merging: String
    addUser(name: String!, surname: String!, mail: String!, password: String!, aanhef: String!, adres: String, city: String, postalcode: String, housenumber: String, paymentmethod: String, admin: Boolean!): String!
    alterUser(id: Int!, name: String!, surname: String!, aanhef: String!, mail: String!, password: String!, adres: String!, city: String!, postalcode: String!, housenumber: String!, paymentmethod: String!): String!
    deleteUser(id: Int!): String
    addProduct(id: String!, title: String!, releasedate: Int!, period: Int!, description: String!, physicalmedium: String!, amountofpaintings: Int, src: String!, bigsrc: String!,prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean,painterId: Int!, amountwatched: Int): String!
    alterProduct(id_number: Int!, id: String!, title: String!, releasedate: Int!, period: Int! description: String!, physicalmedium: String!, amountofpaintings: Int, src: String!, bigsrc: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean, amountwatched: Int!): String
    deleteProduct(id: Int!): String
    addPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String!, thumbnail: String!, description: String!): String
    alterPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String!, thumbnail: String!, description: String!, amountwatched: Int!): String
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
  type Paintersearch {
    painter: [Painter],
    total: Int
  },
  """ 
  Collection returns a painting, with all of the attributes present in the database.
  """
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
  """ 
  CollectionWithTotal returns an array of Collection, as well as an integer with the total array-count of Collection.
  """
  type CollectionWithTotal{
    total: Int,
    collection: [Collection]
  },
  """ 
  PainterWithTotal returns an array of Painter, as well as an integer with the total array-count of Painter.
  """
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
    rented: Boolean,
    amountwatched: Int,
    painter: String
  },
  """ 
  Painter returns a painter, with all of the attributes present in the database.
  """
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
  """ 
  TotalUsers returns an array of User, as well as an integer with the total array-count of User.
  """
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