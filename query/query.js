const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


var root = {
  status: () => {
    return 200
  },
  async homeVisit() {
    // add 1 to the homevisit
    let date = this.dateToString(new Date())
    let existing = await db.manyOrNone(`SELECT * FROM sitevisitdate WHERE date = $1`, [date])
    if (!existing.length) {
      // There have been no visits yet on this day
      db.oneOrNone(`INSERT INTO sitevisitdate(date,amount) VALUES($1,$2)`, [date, 1])
        .catch(err => { throw new Error(err) })
    } else {
      db.oneOrNone(`UPDATE sitevisitdate SET amount = amount + 1 WHERE id = ${existing[0].id}`)
        .catch(err => {throw new Error(err)})      
    }
    return 200
  },
  async totalVisitors() {
    let query = await db.manyOrNone(`SELECT * FROM sitevisitdate ORDER BY date`)
    query.forEach(element => {
      element.date = this.dateToString(element.date)
    });
    return query
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
      .catch(err => { throw new Error(err) })

    const preQuery = await db.manyOrNone(`SELECT * FROM schilderijen ORDER BY id_number ASC LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    return {
      total: total[0].count,
      collection: preQuery
    }
  },
  async paintingByID({ id }) {
    db.oneOrNone(`UPDATE schilderijstatistieken SET amountwatched = amountwatched +1 where schilderijid = ${id}`)
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
      .catch(err => { throw new Error(err) })

    let totalPainters = await db.manyOrNone(`SELECT COUNT(*) from schilder`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
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
    db.oneOrNone(`UPDATE schilder SET amountwatched = amountwatched + 1 where id = ${id}`)
    let query = (`SELECT * from schilder where id = ${id}`)
    return db.manyOrNone(query)
  },
  workByPainter: ({ id }) => {
    db.oneOrNone(`UPDATE schilder SET amountwatched = amountwatched + 1 where id = ${id}`)
    let query = (`SELECT * from schilderijen where principalmaker = ${id}`)
    return db.manyOrNone(query)
  },
  //#endregion

  //#region filters
  async filterPaintings({ num = "is not null", prodplace = "is not null", physical = "is not null", pricemin = 0, pricemax = 1000000, order = "id_number", page, amount = 12 }) {
    let offset = (page) * amount
    var period = ""
    if (isNaN(num)) {
      period = num
    } else { period = "= " + num }
    var prod = ""
    if (prodplace != "is not null") {
      prod = `= '${prodplace}'`
    } else { prod = prodplace }
    var medium = ""
    if (physical != "is not null") {
      medium = `= '${physical}'`
    } else { medium = physical }
    ordered = ""
    if (order != "id_number") {
      ordered = `'${order}'`
    } else { ordered = order }
    const total = await db.manyOrNone(`SELECT COUNT(*) FROM schilderijen WHERE period ${period} AND principalmakersproductionplaces ${prod} AND physicalmedium ${medium} AND price BETWEEN ${pricemin} AND ${pricemax} GROUP BY ${ordered} ORDER BY ${ordered}`)

    var preQuery = await db.manyOrNone(`SELECT * FROM schilderijen WHERE period ${period} AND principalmakersproductionplaces ${prod} AND physicalmedium ${medium} AND price BETWEEN ${pricemin} AND ${pricemax} ORDER BY ${ordered} LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })

    return {
      total: total.length,
      collection: preQuery
    }
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
      .catch(err => { throw new Error(err) })

    let total_search = await db.manyOrNone(`SELECT COUNT(*) FROM schilderijen WHERE document_vectors @@ plainto_tsquery('${query}:*')`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })

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
      .catch(err => { throw new Error(err) })

    let total_search = await db.manyOrNone(`SELECT COUNT(*) FROM schilder WHERE document_vectors @@ plainto_tsquery('${query}:*')`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })

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
  async babyTabelSelect({ id }) {
    console.log(`\nBabyselect\n`)
    let BabyNaam = await db.manyOrNone(`SELECT * FROM papatabel where id = ${id}`)
    let BabyContent = await db.manyOrNone(`SELECT * FROM ${BabyNaam[0].naam}`)

    return {
      type: BabyNaam[0].type,
      allItems: BabyContent
    }
  },
  //Create tabel and insert data
  async createBabyTabel({ tabelnaam, foreignkey, type }) {
    if (tabelnaam == "") {
      return 410
    }
    //In order to check if the table already exists
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    tableNameCheck.forEach(element => {
      if (element.table == tabelnaam) {
        return 310
      }
    })

    //Creating the table
    db.oneOrNone(`CREATE TABLE ${tabelnaam} (id serial PRIMARY KEY, foreignKey int)`)
      .catch(err => { throw new Error(err) })

    //Inserting all data into the table
    foreignkey.forEach(element => {
      db.oneOrNone(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1)`, [element.foreignkey])
        .catch(err => { throw new Error(err) })
    })

    //Create ref to the newly created table in the papatabel
    db.oneOrNone(`INSERT INTO papatabel(naam,type) VALUES($1, $2)`, [tabelnaam, type])
      .catch(err => { throw new Error(err) })
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
      db.oneOrNone(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1)`, [element.foreignkey])
    })
    return 200
  },
  //Remove tabel and link in papatabel
  async removeBabyTabel({ id }) {
    let table = await db.manyOrNone(`SELECT * from papatabel WHERE id = ${id}`)
    if (!table.length) {
      return 311
    }

    db.oneOrNone(`DROP TABLE IF EXISTS ${tablename}`)

    //In order to check if the table actually dropped
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    tableNameCheck.forEach(element => {
      if (element.table == tablename) {
        return 510
      }
    })
    db.oneOrNone(`DELETE FROM papatabel WHERE id = ${id}`)
    return 200
  },
  //#endregion

  //#region alter users
  async selectAllUsers({ page, amount }) {
    let offset = (page) * amount

    let users = await db.manyOrNone(`SELECT * FROM gebruiker ORDER BY ID ASC LIMIT ${amount} OFFSET ${offset}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })

    let maxusers = await db.manyOrNone(`SELECT COUNT(*) FROM gebruiker`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })

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
      return 314
    }
    db.oneOrNone(`INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin])
    // .catch(err => {throw new Error(err)})
    return 200
  },
  async alterUser({ id, name, surname, mail, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin }) {
    const user = await db.manyOrNone(`SELECT * from gebruiker where id = ${[id]}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!user.length) {
      return 311
    }
    db.oneOrNone(`UPDATE gebruiker set 
            name = $1, surname = $2, mail = $3, aanhef = $4, adres = $5, city = $6, postalcode = $7,
            housenumber = $8, paymentmethod = $9, admin = $10 WHERE id = ${id}`,
      [name, surname, mail, aanhef, adres, city, postalcode, housenumber, paymentmethod, admin])
      .catch(err => { throw new Error(510) })
    return 200
  },
  async deleteUser({ id }) {
    let user = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${id}`)
    if (user.length) {
      db.oneOrNone(`DELETE from gebruiker WHERE id = ${id}`)
      return 200
    } else {
      return 311
    }
  },
  //#endregion

  //#region alter products
  async addProduct({ id, title, releasedate, period, description, physicalmedium, amountofpaintings = 1, src, bigsrc, prodplace, principalmaker, width, height, price, rented = false, painterId, amountwatched = 0 }) {
    let painting = await db.oneOrNone(`INSERT INTO schilderijen(id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, principalmakersproductionplaces, principalmaker, width, height, price, rented, amountwatched) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING id_number`,
      [id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, principalmaker, width, height, price, rented, amountwatched])
      .then(data => { return data.id_number })
      .catch(err => { throw new Error(err) })

    db.oneOrNone(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${painterId}, ${painting})`)

    db.oneOrNone(`UPDATE schilderijen SET document_vectors = (to_tsvector(coalesce('${title}'))) || (to_tsvector(coalesce('${principalmaker}'))) WHERE id_number = ${painting}`)
    return 200
  },
  //Alter products
  async alterProduct({ id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings = 1, src, bigsrc, prodplace, width, height, principalmaker, price, rented = false, amountwatched }) {
    const prod = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id_number}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!prod.length) {
      return 311
    }
    db.oneOrNone(`UPDATE schilderijen set 
            id_number = $1, id = $2, title = $3, releasedate = $4, period = $5, description = $6, physicalmedium = $7, amountofpaintings = $8, src = $9, bigsrc = $10, principalmakersproductionplaces = $11, width = $12, height = $13, principalmaker = $14, price = $15, rented = $16, amountwatched = $17 WHERE id_number = ${id_number}`,
      [id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, width, height, principalmaker, price, rented, amountwatched])
    db.manyOrNone(`UPDATE schilderijen SET document_vectors = (to_tsvector(coalesce())) || (to_tsvector(coalesce(\'\'${principalmaker}\'\'))) WHERE id_number = ${id_number}`)
    return 200
  },
  //Delete products
  async deleteProduct({ id }) {
    let prod = await db.manyOrNone(`SELECT * from schilderijen WHERE id_number = ${id}`)
    if (!prod.length) {
      return 311
    }
    db.oneOrNone(`DELETE FROM schilderijen WHERE id_number = ${id}`)
    return 200
  },
  //#endregion

  //#region where admin can add and change painters
  async addPainter({ name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description }) {
    const painter = await db.manyOrNone(`SELECT name from schilder where name = $1`, [name])
    if (painter.length) {
      return 310
    }
    let id = await db.one(`INSERT INTO schilder(name, city, dateofbirth, dateofdeath, placeofdeath, occupation, nationality, headerimage, thumbnail, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, [name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description])
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    db.oneOrNone('UPDATE schilder SET document_vectors = (to_tsvector(coalesce(\'\'$1\'\'))) WHERE id = $2', [name, id])
    return 200
  },
  async alterPainter({ id, name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description, amountwatched }) {
    const painter = await db.manyOrNone(`SELECT * from schilder WHERE id = ${id}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!painter.length) {
      return 310
    }
    db.oneOrNone(`UPDATE schilder set
            name = $2, city = $3, dateofbirth = $4, dateofdeath = $5, placeofdeath = $6, occupation = $7, nationality = $8, headerimage = $9, thumbnail = $10, description = $11, amountwatched = $12 WHERE id = ${id}`, [id, name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description, amountwatched])
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    db.oneOrNone('UPDATE schilder SET document_vectors = (to_tsvector(coalesce(\'\'$1\'\'))) WHERE id = $2', [name, id])
    return 200
  },
  async deletePainter({ id }) {
    let painter = await db.manyOrNone(`SELECT * from schilder WHERE id = ${id}`)
    if (!painter.length) {
      return 311
    }
    db.oneOrNone(`DELETE from schilder WHERE id = ${id}`)
    return 200
  },
  //#endregion

  //#region FAQ  
  async faqCreate({ question, answer }) {
    db.oneOrNone(`INSERT INTO faq(title, body) VALUES($1,$2)`, [question, answer])
      .catch(err => { throw new Error(510) })
    return 200
  },
  async faqUpdate({ question, answer, id }) {
    let faq = await db.manyOrNone(`SELECT * from faq WHERE id = ${id}`)
    if (!faq.length) {
      return 311
    }
    db.oneOrNone(`UPDATE faq set title = $1, body = $2 
              WHERE id = ${id}`, [question, answer])
    return 200
  },
  async faqDelete({ id }) {
    let faq = await db.manyOrNone(`SELECT * from faq WHERE id = ${id}`)
    if (!faq.length) {
      return 311
    }
    db.oneOrNone(`DELETE FROM faq WHERE id = ${id}`)
    return 200
  },
  //#endregion
  //#endregion  

  //#region  FAQ
  faq: () => {
    let query = ('SELECT * from faq ORDER BY id')
    return db.manyOrNone(query)
  },
  faqId: ({ id }) => {
    return db.oneOrNone(`SELECT * from faq where id = ${id}`)
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
      db.oneOrNone(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${id}, ${id_number})`)
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
    //   await db.oneOrNone(`INSERT INTO schilderschilderij (schilder, schilderij) values(${schilderNum[0].id}, ${i}) RETURNING id`).then(data => {return data})  
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
    console.log(time)
    let check = await db.manyOrNone(`SELECT id FROM gebruiker WHERE id= ${gebruikerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!check.length) {
      // Provided user doesn't exist
      return 311
    }
    console.log(new Date(time))
    if (new Date(time).toString() == "Invalid Date") {
      console.log("invalid date")
      return 317
    }
    let current = await db.manyOrNone(`SELECT * FROM wishlist WHERE gebruikerid = ${gebruikerId}`)
    if (current.length) {
      db.oneOrNone(`UPDATE wishlist set items = $1, timestamp = $2 WHERE gebruikerid = ${gebruikerId}`, [items, time])
      return 200
    } else {
      db.oneOrNone(`INSERT INTO wishlist(gebruikerid, items, timestamp) VALUES ($1,$2,$3)`, [gebruikerId, items, time])
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
      db.oneOrNone(`UPDATE shoppingcart set items = $1, timestamp = $2 WHERE gebruikerid = ${gebruikerId}`, [items, time])
        .catch(err => { throw new Error(err) })
      return 200
    } else {
      db.oneOrNone(`INSERT INTO shoppingcart(gebruikerid, items, timestamp) VALUES($1,$2,$3) `, [gebruikerId, items, time])
        .catch(err => { throw new Error(err) })
      return 200
    }
  },
  async orderListSelect({ buyerId }) {
    // Get all dates at which a buyer has bought a painting
    let Lijst = await db.manyOrNone(`SELECT * FROM ordered WHERE buyerid = ${buyerId} ORDER BY id`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    let items = []
    // Get all paintings bought by the buyer
    for (let index = 0; index < Lijst.length; index++) {
      const element = Lijst[index];
      element.purchasedate = this.dateToString(element.purchasedate)
      let painting = await db.manyOrNone(`SELECT * FROM orders WHERE refto_ordered = ${element.id} ORDER BY id`)
      items.push(painting)
    }
    // Creating the return type
    let OrdersByDate = []
    // Loop for the total amount of dates at which a purchase has been made
    for (let i = 0; i < Lijst.length; i++) {
      const koper = Lijst[i]
      // Add buyer info to the return type
      OrdersByDate.push({
        id: koper.id,
        buyerid: koper.buyerid,
        purchasedate: koper.purchasedate,
        items: []
      })
      // Loop for the total amount of painting bought on a given date 
      for (let j = 0; j < items[i].length; j++) {
        const OrderInfo = items[i][j]
        // Add order info to the return type
        OrdersByDate[i].items.push({
          id: OrderInfo.id,
          refto_ordered: OrderInfo.refto_ordered,
          items: OrderInfo.items,
          status: OrderInfo.status
        })
      }
    }
    // Return the return type
    return OrdersByDate
  },
  async orderListInsert({ buyerId = 183, items, date }) {
    let existing = await db.manyOrNone(`SELECT * FROM ordered WHERE buyerid = ${buyerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!existing.length) {
      // If the user hasn't made any orders yet
      let place = await db.one(`INSERT INTO ordered(buyerid, purchasedate) VALUES($1,$2) RETURNING ID`, [buyerId, date])
        .then(data => { return data })
        .catch(err => { throw new Error(err) })
      items.forEach(element => {
        db.oneOrNone(`INSERT INTO orders(refto_ordered, items) VALUES($1,$2)`, [place.id, element.foreignkey])
      })
    } else {
      // If the user has previously made a order
      let row = -1
      existing.forEach(element => {
        element.purchasedate = this.dateToString(element.purchasedate)
        if (element.purchasedate == date) {
          // The date is equal, meaning the buyer has already made a purchase on this day
          row = element.id
          return
        }
      })
      if (row != -1) {
        // If the user has already made a purchase on this day
        items.forEach(element => {
          db.oneOrNone(`INSERT INTO orders(refto_ordered, items) VALUES($1,$2)`, [row, element.foreignkey])
        })
      } else {
        // If the user hasn't yet made a purchase on this day
        let place = await db.one(`INSERT INTO ordered(buyerid, purchasedate) VALUES($1,$2) RETURNING ID`, [buyerId, date])
          .then(data => { return data })
          .catch(err => { throw new Error(err) })
        items.forEach(element => {
          db.oneOrNone(`INSERT INTO orders(refto_ordered, items) VALUES($1,$2)`, [place.id, element.foreignkey])
        })
      }
    }
    return 200
  },

  async Trackpainting({ schilderijid, date }) {
    let exist = await db.manyOrNone(`SELECT * from schilderijdate where schilderijid = ${schilderijid}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!exist.length) {
      // If the user hasn't checked any paintings yet
      let place = await db.one(`INSERT INTO schilderijdate(schilderijid, date) VALUES($1,$2) RETURNING ID`, [schilderijid, date])
        .then(data => { return data })
        .catch(err => { throw new Error(err) })
      db.oneOrNone(`INSERT INTO schilderijamount(refto_schilderijdate, amountwatched) VALUES($1,$2)`, [place.id, 1])
    } else {
      // If the user has previously checked a painting
      let row = -1
      exist.forEach(element => {
        element.date = this.dateToString(element.date)
        if (element.date == date) {
          // The date is equal, meaning the user has already checked the painting on the same day
          row = element.id
          return
        }
      })
      if (row != -1) {
        // If the user has already checked a painting on the same day
        db.oneOrNone(`UPDATE schilderijamount SET amountwatched = amountwatched + 1 where id = ${row}`)
      } else {
        // If the user hasn't yet checked the painting yet
        let place = await db.one(`INSERT INTO schilderijdate(schilderijid, date) VALUES($1,$2) RETURNING ID`, [schilderijid, date])
          .then(data => { return data })
          .catch(err => { throw new Error(err) })
        db.oneOrNone(`INSERT INTO schilderijamount(refto_schilderijdate, amountwatched) VALUES($1,$2)`, [place.id, 1])
      }
    }
    return 200
  },

  async Trackpainter({ schilderid, date }) {
    let exist = await db.manyOrNone(`SELECT * from schilderdate where schilderid = ${schilderid}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!exist.length) {
      // If the user hasn't checked any painters yet
      let place = await db.one(`INSERT INTO schilderdate(schilderid, date) VALUES($1,$2) RETURNING ID`, [schilderid, date])
        .then(data => { return data })
        .catch(err => { throw new Error(err) })
      db.oneOrNone(`INSERT INTO schilderamount(refto_schilderdate, amountwatched) VALUES($1,$2)`, [place.id, 1])
    } else {
      // If the user has previously checked a painter
      let row = -1
      exist.forEach(element => {
        element.date = this.dateToString(element.date)
        if (element.date == date) {
          // The date is equal, meaning the user has already checked the painter on the same day
          row = element.id
          return
        }
      })
      if (row != -1) {
        // If the user has already checked a painter on the same day
        db.oneOrNone(`UPDATE schilderamount SET amountwatched = amountwatched + 1 where id = ${row}`)
      } else {
        // If the user hasn't yet checked the painter yet
        let place = await db.one(`INSERT INTO schilderdate(schilderid, date) VALUES($1,$2) RETURNING ID`, [schilderid, date])
          .then(data => { return data })
          .catch(err => { throw new Error(err) })
        db.oneOrNone(`INSERT INTO schilderamount(refto_schilderdate, amountwatched) VALUES($1,$2)`, [place.id, 1])
      }
    }
    return 200
  },

  async orderListUpdate({ id, newStatus }) {
    let selection = await db.manyOrNone(`SELECT * FROM orders WHERE id = ${id}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!selection.length) {
      return 313
    }
    db.oneOrNone(`UPDATE orders SET status = $1 WHERE id = $2 `, [newStatus, id])
      .catch(err => { throw new Error(err) })
    return 200
  },
  async rentalListSelect({ buyerId }) {
    // Get all dates at which a buyer has rented a painting
    let Lijst = await db.manyOrNone(`SELECT * FROM rented WHERE buyerid = ${buyerId} ORDER BY id`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    let items = []
    // Get all paintings rented by the buyer
    for (let j = 0; j < Lijst.length; j++) {
      const element1 = Lijst[j];
      element1.purchasedate = this.dateToString(element1.purchasedate)
      let painting = await db.manyOrNone(`SELECT * FROM rentals WHERE refto_rented = ${element1.id} ORDER BY id`)
      for (let i = 0; i < painting.length; i++) {
        const element2 = painting[i];
        element2.rentstart = this.dateToString(element2.rentstart)
        element2.rentstop = this.dateToString(element2.rentstop)
      }
      items.push(painting)
    }
    // Creating the return type
    let RentalsByDate = []
    // Loop for the total amount of dates at which a rental has been made
    for (let i = 0; i < Lijst.length; i++) {
      const koper = Lijst[i];
      // Add buyer info to the return type
      RentalsByDate.push({
        id: koper.id,
        buyerid: koper.buyerid,
        purchasedate: koper.purchasedate,
        items: []
      })
      // Loop for the total amount of painting bought on a given date 
      for (let j = 0; j < items[i].length; j++) {
        const RentalInfo = items[i][j];
        // Add order info to the return type
        RentalsByDate[i].items.push({
          id: RentalInfo.id,
          rentstart: RentalInfo.rentstart,
          rentstop: RentalInfo.rentstop,
          refto_rented: RentalInfo.refto_rented,
          items: RentalInfo.items,
          status: RentalInfo.status
        })
      }
    }
    // Return the return type
    return RentalsByDate
  },
  async rentalListInsert({ buyerId, items, date }) {
    console.log("\nRLI")
    let existing = await db.manyOrNone(`SELECT * FROM rented WHERE buyerid = ${buyerId}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!existing.length) {
      // If the user hasn't made any rentals yet
      let place = await db.one(`INSERT INTO rented(buyerid, purchasedate) VALUES($1,$2) RETURNING ID`, [buyerId, date])
        .then(data => { return data })
        .catch(err => { throw new Error(err) })
      items.forEach(element => {
        db.oneOrNone(`INSERT INTO rentals(rentstart, rentstop, items, refto_rented) VALUES($1,$2,$3,$4)`, [element.startDate, element.stopDate, element.foreignkey, place.id])
      })
    } else {
      // If the user has previously made a order
      let row = -1
      existing.forEach(element => {
        element.purchasedate = this.dateToString(element.purchasedate)
        if (element.purchasedate == date) {
          // The date is equal, meaning the buyer has already made a purchase on this day
          row = element.id
          return
        }
      })
      if (row != -1) {
        // If the user has already made a purchase on this day
        items.forEach(element => {
          db.oneOrNone(`INSERT INTO rentals(rentstart, rentstop, items, refto_rented) VALUES($1,$2,$3,$4)`, [element.startDate, element.stopDate, element.foreignkey, row])
        })
      } else {
        // If the user hasn't yet made a purchas eon this day
        let place = await db.one(`INSERT INTO rented(buyerid, purchasedate) VALUES($1,$2) RETURNING ID`, [buyerId, date])
          .then(data => { return data })
          .catch(err => { throw new Error(err) })
        items.forEach(element => {
          db.oneOrNone(`INSERT INTO rentals(rentstart, rentstop, items, refto_rented) VALUES($1,$2,$3,$4)`, [element.startDate, element.stopDate, element.foreignkey, place.id])
        })
      }
    }
    return 200
  },
  async rentalListUpdate({ id, newStatus }) {
    let selection = await db.manyOrNone(`SELECT * FROM rentals WHERE id = ${id}`)
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
    if (!selection.length) {
      return 313
    }
    db.oneOrNone(`UPDATE rentals SET status = $1 WHERE id = $2`, [newStatus, id])
      .catch(err => { throw new Error(err) })
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
      .catch(err => { throw new Error(err) })
  },
  //user login
  async login({ email, password }) {
    const user = await db.manyOrNone('SELECT * from gebruiker where mail = $1', [email])
      .then(data => { return data })
      .catch(err => { throw new Error(err) })
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