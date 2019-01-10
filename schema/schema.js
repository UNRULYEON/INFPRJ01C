const { buildSchema } = require('graphql');

var schema = buildSchema(`
  """ 
  Query is a GET statement, and can only retrieve data from the DataBase.
  """
  type Query {
    """Hello is a simple test to see if the server is running."""
    hello: String
    """Collection returns an array of paintings ordered by number, with a limit of 15."""
    collection: [Collection]
    popularPainter: [Painting]
    popularpaintings: [Painting]
    unpopularpaintings: [Painting]
    bestsellingpaintings: [Painting]
    leastsellingpaintings: [Painting]
    amountRentedPaintings: Int
    """CollectionSearch returns an array of paintings ordered by number."""
    collectionSearch: [Collection]
    """PaintingOrderedByPagination takes the page and the amount of items that should be shown per page, and returns an array of paintings."""
    paintingOrderedByPagination(page: Int!, amount: Int): CollectionWithTotal
    """PaintingByID takes an ID (primary) en returns all associated content."""
    paintingByID(id: String!): [Painting]
    """workByPainter takes the name of a painter and returns all painting made by that painter."""
    workByPainter(id: String!): [Painting]
    """filterbyperiod takes a period and returns all paintings made in that period."""
    filterbyperiod(period: Int!): [Painting]
    """THE FOLLOWING 4 FILTERS RETURN ALL PAINTINGS ORDERED DIFFERENTLY, SEE TITLE OF EACH FUNCTION."""
    filterbypriceasc: [Painting]
    filterbypricedesc: [Painting]
    filterbytitleasc: [Painting]
    filterbytitledesc: [Painting]
    """Returns all Painters."""
    paintersAll: [Painter]
    """Returns all Painters, paginated."""
    paintersAdmin(page: Int!, amount: Int): PainterWithTotal
    """Takes an ID of a painter, and returns all associated data."""
    painterByID(id: String!): [Painter]
    """Returns a combination of a painting, allong with the painter."""
    PaintingsByPainter(id: String!): [ret]
    """Checks if the given mail exists in the DataBase."""
    checkUser(mail: String!): Boolean!
    me: User
    """Returns all users, paginated."""
    selectAllUsers(page: Int!, amount: Int!): TotalUsers
    """Takes an ID of a user, and returns all associated data."""
    selectUserById(id: Int!): User
    """Returns an array containing all FAQ's"""
    faq: [FAQ]
    """Takes an ID of a FAQ, and returns all associated data."""
    faqId(id: Int!): FAQ
    """Test to see if the server is running"""
    status: Int 
    """Use to retrieve all of the content"""
    papatabel: [PapaGet]
    """Provide an ID and retrieve all associated content"""
    babyTabelSelect(id: Int!): BabyType
    """Provide the KEY of the user, and recieve all purchases, grouped by the purchase date"""
    orderListSelect(buyerId: Int!): [Ordered]
    """Provide the KEY of the user, and recieve all rentals grouped by the purchase date"""
    rentalListSelect(buyerId: Int!): [Rented]
    """Provide the KEY of the user, and recieve all items that are in the associated shopping cart"""
    selectShoppingCart(userId: Int!): [Cart]
    searchbar(query: String!, page: Int!, amount: Int): searchResult
    searchpainter(query: String!, page: Int!, amount: Int): Paintersearch
    """Provide the KEY of the user, and recieve all items that are in the associated wishlist"""
    wishlistSelect(userId: Int!): [wishlist]
    filterPaintings(num: Int, prodplace: String, physical: String, pricemin: Int, pricemax: Int, order: String, page: Int!, amount: Int): CollectionWithTotal
    totalVisitors: [VisitDate]
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
    alterUser(id: Int!, name: String!, surname: String!, aanhef: String!, mail: String!, adres: String!, city: String!, postalcode: String!, housenumber: String!, paymentmethod: String!, admin: Boolean!): String!
    alterUserClient(id: Int!, name: String!, surname: String!, aanhef: String!, mail: String!, password: String!, adres: String!, city: String!, postalcode: String!, housenumber: String!, paymentmethod: String!): String!
    deleteUser(id: Int!): String
    addProduct(id: String!, title: String!, releasedate: Int!, period: Int!, description: String!, physicalmedium: String!, amountofpaintings: Int, src: String!, bigsrc: String!,prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean,painterId: Int!, amountwatched: Int): String!
    alterProduct(id_number: Int!, id: String!, title: String!, releasedate: Int!, period: Int!, description: String!, physicalmedium: String!, amountofpaintings: Int, src: String!, bigsrc: String!, prodplace: String!, width: Int!, height: Int!, principalmaker: String!, price: Int!, rented: Boolean, amountwatched: Int!): String
    deleteProduct(id: Int!): String
    addPainter(name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerImage: String!, thumbnail: String!, description: String!): String
    alterPainter(id: Int!, name: String!, city: String!, dateBirth: String!, dateDeath: String!, placeDeath: String!, occupation: String!, nationality: String!, headerimage: String, thumbnail: String, description: String!): String
    deletePainter(id: String!): String
    createBabyTabel(tabelnaam: String!, foreignkey: [RefBaby!], type: String!): String
    addToBabyTabel(id: Int!, foreignkey: [RefBaby!]): String
    removeBabyTabel(id: Int!): String
    shoppingCartInsert(gebruikerId: Int!, items: String!, time: String!): String
    """Provide the id of the buyer and the date at which the items are bought, and provide an array of paintings KEY's"""
    orderListInsert(buyerId: Int, items: [PaintRef!], date: String!, total: Int!): String
    """Provide the id of the buyer and the date at which the items are bought, and provide an array of paintings KEY's"""
    rentalListInsert(buyerId: Int!, items: [PaintRefRent!], date: String!, total: Int!): String
    Trackpainting(schilderijid: Int!, date: String!): String
    Trackpainter(schilderid: Int!, date: String!): String
    """Provide the new status of the order associated to the, also given, id"""
    orderListUpdate(id: Int!, newStatus: String!): String
    """Provide the new status of the rental associated to the, also given, id"""
    rentalListUpdate(id: Int!, newStatus: String!): String
    WishlistInsert(gebruikerId: Int!, items: String!, time: String!): String
    faqCreate(question: String!, answer: String!): String
    faqUpdate(question: String!, answer: String!, id: Int!): String
    faqDelete(id: Int!): String!
    """Gets triggered when someone visits the homepage and adds 1 to the amount of visitors"""
    homeVisit: String
  },
  input PaintRef{
    foreignkey: Int!
  },
  input PaintRefRent{
    foreignkey: Int!, 
    startDate: String!, 
    stopDate: String!},
  input RefBaby{
    foreignkey: Int!
  },
  type VisitDate{
    id: Int,
    date: String,
    amount: Int
  }
  type PapaGet{
    id: Int,
    naam: String,
    type: String
  },
  type BabyType{
    type: String!,
    allItems: [BabyReturn]
  },
  type BabyReturn{
    id: Int,
    foreignkey: Int
  },
  type Cart{
    id: Int,
    gebruikerid: Int,
    items: String,
    timestamp: String
  },
  type Ordered{
    id: Int,
    buyerid: Int,
    purchasedate: String,
    items: [Orders],
    total: Int
  },
  type Orders{
    id: Int,
    refto_ordered: Int,
    items: Int,
    status: String
  },
  type Rented{
    id: Int,
    buyerid: Int,
    purchasedate: String,    
    items: [Rentals],
    total: Int
  },
  type Rentals{
    id: Int,
    rentstart: String,
    rentstop: String,
    items: Int,
    refto_rented: Int,
    status: String
  }
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
    placeofdeath: String,
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