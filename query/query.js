const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


var root = {
  status: () => {
    return 200
  },
  //#region Painting
  collection: () => {
    let query = 'SELECT * from schilderijen ORDER BY id_number ASC limit 15'
    return db.manyOrNone(query)
  },
  collectionSearch: () => {
    let query = 'SELECT * from schilderijen ORDER BY id_number ASC'
    return db.manyOrNone(query)
  },
  async paintingOrderedByPagination({ page, amount = 12 }) {
    let offset = (page) * amount

    const total = await db.manyOrNone('SELECT COUNT(*) from schilderijen')
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    const preQuery = await db.manyOrNone(`SELECT * FROM schilderijen ORDER BY id_number ASC LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    return {
      total: total[0].count,
      collection: preQuery
    }
  },
  async paintingByID({ id }) {
    db.one(`UPDATE schilderijen SET amountwatched = amountwatched + 1 where id_number = ${id}`)
    let queryPainting = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id}`)
    let painting = queryPainting[0]
    let queryPainter = await db.manyOrNone(`SELECT schilder from schilderschilderij where schilderij = ${id}`)
    let painter = queryPainter[0].schilder
    return [{
      id: painting.id,
      id_number: painting.id_number,
      title: painting.title,
      releasedate: painting.releasedate,
      period: painting.period,
      description: painting.description,
      physicalmedium: painting.physicalmedium,
      amountofpaintings: painting.amountofpaintings,
      src: painting.src,
      bigsrc: painting.bigsrc,
      plaquedescriptiondutch: painting.plaquedescriptiondutch,
      principalmakersproductionplaces: painting.principalmakersproductionplaces,
      width: painting.width,
      height: painting.height,
      principalmaker: painting.principalmaker,
      price: painting.price,
      rented: painting.rented,
      amountwatched: painting.amountwatched,
      painter: painter,

    }]
  },
  PaintingsByPainter: ({ id }) => {
    let query = (`SELECT * from schilderijen, schilder WHERE schilder.id = ${id} AND schilderijen.principalmaker = schilder.name`)
    return db.manyOrNone(query)
  },
  //#endregion

  //#region Painters
  paintersAll: () => {
    let query = `SELECT * from schilder ORDER BY NAME ASC`
    return db.manyOrNone(query)
  },
  async paintersAdmin({ page, amount = 12 }) {
    let offset = (page) * amount

    let painter = await db.manyOrNone(`SELECT * from schilder ORDER BY ID ASC LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    let totalPainters = await db.manyOrNone(`SELECT COUNT(*) from schilder`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    return {
      total: totalPainters[0].count,
      painterpagination: painter
    }
  },
  paintersPaginated: () => {
    let query = `SELECT * from schilder ORDER BY ID ASC limit 15`
    return db.manyOrNone(query)
  },
  painterByID: ({ id }) => {
    db.one(`UPDATE schilder SET amountwatched = amountwatched + 1 where id = ${id}`)
    let query = (`SELECT * from schilder where id = ${id}`)
    return db.manyOrNone(query)
  },
  workByPainter: ({ id }) => {
    db.one(`UPDATE schilder SET amountwatched = amountwatched + 1 where id = ${id}`)
    let query = (`SELECT * from schilderijen where principalmaker = ${id}`)
    return db.manyOrNone(query)
  },
  //#endregion

  //#region filters
  async filterPaintings({ num = "is not null", prodplace = "is not null", physical = "is not null", pricemin = 0, pricemax = 1000000, order = 'price' }) {
    var period = ""
    if (isNaN(num)) {
      period = num
    } else { period = "= " + num }
    var prod = ""
    if (prodplace != "is not null") {
      prod = `= '${prodplace}'`
    } else {
      prod = prodplace
    }
    var medium = ""
    if (physical != "is not null") {
      medium = `= '${physical}'`
    } else {
      medium = physical
    }
    order = `'${order}'`
    var query = await db.manyOrNone(`SELECT * FROM schilderijen WHERE period ${period} AND principalmakersproductionplaces ${prod} AND physicalmedium ${medium} AND price BETWEEN ${pricemin} AND ${pricemax} ORDER BY ${order}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    return query
  },

  filterbyperiod: ({ period }) => {
    let query = (`SELECT * from schilderijen where period = ${period} ORDER BY ID_NUMBER ASC`)
    return db.manyOrNone(query)
  },
  filterbypriceasc: () => {
    let query = (`SELECT * from schilderijen ORDER BY price asc`)
    return db.manyOrNone(query)
  },
  filterbypricedesc: () => {
    let query = (`SELECT * from schilderijen ORDER BY price desc`)
    return db.manyOrNone(query)
  },
  filterbytitleasc: () => {
    return db.manyOrNone(`SELECT * FROM schilderijen ORDER BY title asc`)
  },
  filterbytitledesc: () => {
    return db.manyOrNone(`SELECT * FROM schilderijen ORDER BY title desc`)
  },
  //#endregion

  //#region SearchClient
  //searchfunction 
  async searchbar({ query, page, amount = 12 }) {
    let offset = (page - 1) * amount

    let search = await db.manyOrNone(` SELECT * FROM schilderijen WHERE document_vectors @@ plainto_tsquery('${query}:*') LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    let total_search = await db.manyOrNone(`SELECT COUNT(*) FROM schilderijen WHERE document_vectors @@ plainto_tsquery('${query}:*')`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    return {
      total: total_search[0].count,
      paintings: search
    }
  },
  //#endregion

  //#region Search Admin
  async searchpainter({ query, page, amount = 12 }) {
    let offset = (page - 1) * amount

    let search = await db.manyOrNone(` SELECT * FROM schilder WHERE document_vectors @@ plainto_tsquery('${query}:*') LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    let total_search = await db.manyOrNone(`SELECT COUNT(*) FROM schilder WHERE document_vectors @@ plainto_tsquery('${query}:*')`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})

    return {
      total: total_search[0].count,
      painters: search
    }
  },
  //#endregion

  //#region Admin

  //#region papa & baby tabel
  papatabel: () => {
    return db.manyOrNone(`SELECT * FROM papatabel`)
  },
  //Create tabel and insert data
  async createBabyTabel({ tabelnaam, foreignkey, type }) {
    if (tabelnaam == "") {
      return 410
    }
    //In order to check if the table already exists
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    tableNameCheck.forEach(element => {
      if (element.table == tabelnaam) {
        return 310
      }
    })

    //Creating the table
    db.one(`CREATE TABLE ${tabelnaam} (id serial PRIMARY KEY, foreignKey int)`)
      .then()
      .catch(err => { throw new Error(err)})

    //Inserting all data into the table
    foreignkey.forEach(element => {
      db.one(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1)`, [element.foreignkey])
        .then()
        .catch(err => { throw new Error(err)})
      })

    //Create ref to the newly created table in the papatabel
    db.one(`INSERT INTO papatabel(naam,type) VALUES($1, $2)`, [tabelnaam, type])
      .then()
      .catch(err => { throw new Error(err)})
    return 200
    },
  //Add content to babytabel
  async addToBabyTabel({ id, foreignkey }) {
    let table = await db.manyOrNone(`SELECT * from papatabel WHERE id = ${id}`)
    if (!table.length) {
      return 311
    }
    let tabelnaam = table[0].naam
    foreignkey.forEach(element => {
      db.one(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1)`, [element.foreignkey])
    })
    return 200
  },
  //Remove tabel and link in papatabel
  async removeBabyTabel({ id }) {
    let table = await db.manyOrNone(`SELECT * from papatabel WHERE id = ${id}`)
    if (!table.length) {
      return 311
    }

    db.one(`DROP TABLE IF EXISTS ${tablename}`)

    //In order to check if the table actually dropped
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
      .then(data => { return data })
      .catch(err => {throw new Error(err)})
    tableNameCheck.forEach(element => {
      if (element.table == tablename) {
        return 510
      }
    })
    db.one(`DELETE FROM papatabel WHERE id = ${id}`)
    return 200
  },
  //#endregion

  //#region alter users
  async selectAllUsers({ page, amount }) {
    let offset = (page) * amount

    let users = await db.manyOrNone(`SELECT * FROM gebruiker ORDER BY ID ASC LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})


    let maxusers = await db.manyOrNone(`SELECT COUNT(*) FROM gebruiker`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})


    return {
      total: maxusers[0].count,
      totaluser: users
    }
  },
  async selectUserById({ id }) {
    return await db.one(`SELECT * FROM gebruiker where id = ${id}`)
  },
  async addUser({ name, surname, mail, password, aanhef, adres = null, city = null, postalcode = null, housenumber = null, paymentmethod = null, admin }) {
    const saltedPassword = await bcrypt.hash(password, 10)
    const user = await db.manyOrNone(`SELECT mail from gebruiker where mail = $1`, [mail])
    if (user.length) {
      return 310
    }
    db.one(`INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin])
      // .catch(err => {throw new Error(err)})
    return 200
  },
  async alterUser({ id, name, surname, mail, password, aanhef, adres, city, postalcode, housenumber, paymentmethod }) {
    const user = await db.manyOrNone(`SELECT * from gebruiker where id = ${[id]}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    if (!user.length) {
      return 311
    }
    const saltedPassword = await bcrypt.hash(password, 10)
    db.one(`UPDATE gebruiker set 
            name = $1, surname = $2, mail = $3, password = $4,
            aanhef = $5, adres = $6, city = $7, postalcode = $8,
            housenumber = $9, paymentmethod = $10 WHERE id = ${id}`,
            [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode, housenumber, paymentmethod])
        .catch(err => {throw new Error(510)})
      return 200
  },
  async deleteUser({ id }) {
    let user = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${id}`)
    if (user.length) {
      let query = `DELETE from gebruiker WHERE id = ${id}`
      return await db.one(query)
    } else {
      return 311
    }
  },
  //#endregion

  //#region alter products
  async addProduct({ id, title, releasedate, period, description, physicalmedium, amountofpaintings = 1, src, bigsrc, prodplace, principalmaker, width, height, price, rented = false, painterId, amountwatched = 0 }) {
    let painting = await db.one(`INSERT INTO schilderijen(id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, principalmakersproductionplaces, principalmaker, width, height, price, rented, amountwatched) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_number`,
      [id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, principalmaker, width, height, price, rented, amountwatched])
      .then(data => { return data.id_number })
      .catch(err => { throw new Error(err) })

    db.one(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${painterId}, ${painting})`)

    db.one(`UPDATE schilderijen SET document_vectors = (to_tsvector(coalesce('${title}'))) || (to_tsvector(coalesce('${principalmaker}'))) WHERE id_number = ${painting}`)
    return 200
  },
  //Alter products
  async alterProduct({ id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings = 1, src, bigsrc, prodplace, width, height, principalmaker, price, rented = false, amountwatched }) {
    const prod = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id_number}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    if (!prod.length) {
      return 311
    }
    db.one(`UPDATE schilderijen set 
            id_number = $1, id = $2, title = $3, releasedate = $4, period = $5, description = $6, physicalmedium = $7, amountofpaintings = $8, src = $9, bigsrc = $10, principalmakersproductionplaces = $11, width = $12, height = $13, principalmaker = $14, price = $15, rented = $16, amountwatched = $17 WHERE id_number = ${id_number}`,
            [id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, width, height, principalmaker, price, rented, amountwatched])
    db.one(`UPDATE schilderijen SET document_vectors = (to_tsvector(coalesce('${title}'))) || (to_tsvector(coalesce('${principalmaker}'))) WHERE id_number = ${id_number}`)
      return 200
  },
  //Delete products
  async deleteProduct({ id }) {
    let prod = await db.manyOrNone(`SELECT * from schilderijen WHERE id_number = ${id}`)
    if (!prod.length) {
      return 311
    }
    db.one(`DELETE FROM schilderijen WHERE id_number = ${id}`)
    return 200
  },
  //#endregion

  //#region alter painters
  async addPainter({ name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description }) {
    const painter = await db.manyOrNone(`SELECT name from schilder where name = $1`, [name])
    if (painter.length) {
      return 310
    }
    db.one(`INSERT INTO schilder(name, city, dateofbirth, dateofdeath, placeofdeath, occupation, nationality, headerimage, thumbnail, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description])
    db.one(`UPDATE schilder SET document_vectors = (to_tsvector(coalesce('${name}'))) WHERE name = ${painter}`)
    return 200
  },
  async alterPainter({ name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description, amountwatched }) {
    const painter = await db.manyOrNone(`SELECT * from schilder WHERE name = ${name}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    if (!painter.length) {
      return 310
    }
    db.one(`UPDATE schilder set
            name = $1, city = $2, dateofbirth = $3, dateofdeath = $4, placeofdeath = $5, occupation = $6, nationality = $7, headerimage = $8, thumbnail = $9, description = $10, amountwatched = $11 WHERE name = ${name}`, [name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description, amountwatched])
    db.one(`UPDATE schilder SET document_vectors = (to_tsvector(coalesce('${name}'))) WHERE name = ${painter}`)
    return 200
    },
  async deletePainter({ name }) {
    let painter = await db.manyOrNone(`SELECT * from schilder WHERE name = ${name}`)
    if (!painter.length) {
      return 311
    }
    db.one(`DELETE from schilder WHERE name = ${name}`)
    return 200
  },
  //#endregion

  //#region FAQ  
  async faqCreate({ question, answer }) {
    db.one(`INSERT INTO faq(title, body) VALUES($1,$2)`, [question, answer])
      .catch(err => { throw new Error(510) })
    return 200
  },
  async faqUpdate({ question, answer, id }) {
    let faq = await db.manyOrNone(`SELECT * from faq WHERE id = ${id}`)
    if (!faq.length) {
      return 311
    }
      db.one(`UPDATE faq set question = $1,answer = $2 
              WHERE id = ${id}`, [question, answer])
      return 200
  },
  async faqDelete({ id }) {
    let faq = await db.manyOrNone(`SELECT * from faq WHERE id = ${id}`)
    if (!faq.length) {
      return 311
    }
  db.one(`DELETE FROM faq WHERE id = ${id}`)
  return 200
  },
  //#endregion
  //#endregion  

  //#region  FAQ
  faq: () => {
    let query = ('SELECT * from faq')
    return db.manyOrNone(query)
  },
  faqId: ({ id }) => {
    return db.manyOrNone(`SELECT * from faq where id = ${id}`)
  },
  //#endregion

  //#region Random
  dateToString: (givenDate) => {
    let DateDB = givenDate.toString()
    let year = DateDB.slice(11, 15)
    let month = DateDB.slice(4, 7)
    switch (month) {
      case "Jan":
        month = 01
        break;
      case "Feb":
        month = 02
        break;
      case "Mar":
        month = 03
        break;
      case "Apr":
        month = 04
        break;
      case "May":
        month = 05
        break;
      case "Jun":
        month = 06
        break;
      case "Jul":
        month = 07
        break;
      case "Aug":
        month = 08
        break;
      case "Sep":
        month = 09
        break;
      case "Oct":
        month = 10
        break;
      case "Nov":
        month = 11
        break;
      default:
        month = 12
        break;
    }
    let day = DateDB.slice(8, 10)
    return `${year}-${month}-${day}`
  },
  //#endregion

  //#region Merging Painter & Paintings
  //Merge schilder met schilderij 1 at a time
  async merge({ id_number, id }) {
    if (id_number != null != id || id_number != 0 != id) {
      db.one(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${id}, ${id_number})`)
      return 200
    }
  },
  //Merge all
  async merging() {
    // let amount = await db.manyOrNone('SELECT COUNT(*) from schilderijen').then( data => {return data})
    // // console.log(amount[0].count)
    // for (let i = 1; i <= amount[0].count; i++){
    //   // console.log(i)
    //   let schilderNum = await db.manyOrNone(`SELECT schilder.id from schilderijen, schilder WHERE schilderijen.id_number = ${i} AND schilderijen.principalmaker = schilder.name`)
    //  .then( data => {return data})
    //   // console.log(schilderNum[0].id)
    //   // Commented for safety reasons, only uncomment when the entire collection of painters is to be inserted
    //   await db.one(`INSERT INTO schilderschilderij (schilder, schilderij) values(${schilderNum[0].id}, ${i}) RETURNING id`).then(data => {return data})  
    //   console.log(`Insert executed`)  
    // }
    console.log("Commented for safety reasons, only uncomment when the entire collection of painters is to be inserted")
    return 555
  },
  //#endregion

  //#region User
  async wishlistSelect({ userId }) {
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${userId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!check.length) {
      return 310
    }
    let wishlist = await db.manyOrNone(`SELECT * from wishlist WHERE gebruikerid = ${userId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    wishlist.forEach(element => {
      element.timestamp = this.dateToString(element.timestamp)
    })
    return wishlist
  },
  async WishlistInsert({ gebruikerId, items, time }) {
    let check = await db.manyOrNone(`SELECT id FROM gebruiker WHERE id= ${gebruikerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err)})
    if (!check.length) {
      return 311
    }
    let current = await db.manyOrNone(`SELECT * FROM wishlist WHERE gebruikerid = ${gebruikerId}`)
    if (current.length) {
      db.one(`UPDATE wishlist set items = $1, timestamp = $2 WHERE gebruikerid = ${gebruikerId}`, [items, time])
      return 200
    } else {
      db.one(`INSERT INTO wishlist(gebruikerid, items, timestamp) VALUES ($1,$2,$3)`, [gebruikerId, items, time])
      return 200
    }
  },
  async selectShoppingCart({ userId }) {
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${userId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!check.length) {
      return 312
    }
    let cart = await db.manyOrNone(`SELECT * from shoppingcart WHERE gebruikerid = ${userId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    cart.forEach(element => {
      element.timestamp = this.dateToString(element.timestamp)
    })
    return cart
  },
  async shoppingCartInsert({ gebruikerId, items, time }) {
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${gebruikerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!check.length) {
      return 312
    }
    let current = await db.manyOrNone(`SELECT * from shoppingcart WHERE gebruikerid = ${gebruikerId}`)
    if (current.length) {
      db.one(`UPDATE shoppingcart set items = $1, timestamp = $2 WHERE gebruikerid = ${gebruikerId}`, [items, time])
        .catch(err => { throw new Error(err) })
      return 200
    } else {
      db.one(`INSERT INTO shoppingcart(gebruikerid, items, timestamp) VALUES($1,$2,$3) `, [gebruikerId, items, time])
        .catch(err => { throw new Error(err) })
      return 200
    }
  },
  async orderListSelect({ buyerId }) {
    let Lijst = await db.manyOrNone(`SELECT * FROM orderlist
              WHERE buyerid = ${buyerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    Lijst.forEach(element => {
      element.purchasedate = this.dateToString(element.purchasedate)
    });
    return Lijst
  },
  async orderListUpdate({ id, buyerId, newStatus }) {
    let selection = await db.manyOrNone(`SELECT * from orderlist WHERE id = ${id} AND buyerid = ${buyerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!selection.length) {
      return 313
    }
    db.one(`UPDATE orderlist SET status = $1 WHERE id = $2 AND buyerid = $3`, [newStatus, id, buyerId])
      .catch(err => { throw new Error(err) })
    return 200
  },
  async orderListInsert({ gebruikerId = 183, items, purchaseDate }) {
    items.forEach(element => {
      db.one(`INSERT INTO orderlist(buyerid, items, purchasedate) VALUES($1,$2,$3)`, [gebruikerId, element.foreignkey, purchaseDate])
        .catch(err => {throw new Error(err)})
    })
    return 200
  },
  async rentalListInsert({ gebruikerId, items, purchaseDate }) {
    items.forEach(element => {
      db.one(`INSERT INTO rentallist(buyerid,items,purchasedate,rentstart,rentstop) VALUES($1,$2,$3,$4,$5) RETURNING ID`, [gebruikerId, element.foreignkey, purchaseDate, element.startDate, element.stopDate])
        .catch(err => {throw new Error(err)})
    })
    return 200
  },
  async me(req, res, next) {
    if (!res.headers.authorization) {
      return 411
    }
    var decoded = jwt.verify(
      String(res.headers.authorization).slice(7),
      'E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7'
    )
    db.manyOrNone(`SELECT * from gebruiker where id = ${decoded.id}`)
    return 200
  },
  //user signup
  async checkUser({ mail }) {
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])
    // Throw an error when a user with the same email exists
    if (user.length) {
      return true;
    } else {
      return false;
    }
  },
  async signup({ name, surname, mail, password, aanhef, adres, housenumber, city, postalcode, paymentmethod }) {
    // Salt password
    const saltedPassword = await bcrypt.hash(password, 10)

    // Check if a user with the same email exists
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])

    // Throw an error when a user with the same email exists
    if (user.length) {
      return 314
    }

    // Generate token when insertion is complete
    return await db.one('INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, housenumber, city, postalcode, paymentmethod) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id',
      [name, surname, mail, saltedPassword, aanhef, adres, housenumber, city, postalcode, paymentmethod])
      .then(data => {
        let tokens = jwt.sign(
          { id: data.id },
          "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
          { expiresIn: '1d' }
        )
        return {
          id: data.id,
          aanhef: aanhef,
          name: name,
          surname: surname,
          email: mail,
          address: adres,
          housenumber: housenumber,
          city: city,
          postalcode: postalcode,
          housenumber: housenumber,
          paymentmethod: paymentmethod,
          token: tokens
        }
      })
      .catch(err => {throw new Error(err)})
  },
  //user login
  async login({ email, password }) {
    const user = await db.manyOrNone('SELECT * from gebruiker where mail = $1', [email])
      .then(data => {return data})
      .catch(err => { throw new Error(err)})
    if (!user) {
      return 315
    }
    const valid = await bcrypt.compare(password, user[0].password)

    if (!valid) {
      return 316
    }

    let token = jwt.sign(
      { id: user[0].id },
      "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
      { expiresIn: '1d' }
    )

    const userWithToken = {
      id: user[0].id,
      aanhef: user[0].aanhef,
      name: user[0].name,
      surname: user[0].surname,
      email: user[0].mail,
      address: user[0].adres,
      housenumber: user[0].housenumber,
      city: user[0].city,
      postalcode: user[0].postalcode,
      paymentmethod: user[0].paymentmethod,
      admin: user[0].admin,
      token: token
    }

    return userWithToken
  }
  //#endregion
}

module.exports = {
  root
}