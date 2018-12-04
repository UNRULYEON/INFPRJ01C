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
  async paintingOrderedByPagination ({page, amount = 12}) {
    let offset = (page - 1) * amount

    const total = await db.manyOrNone('SELECT COUNT(*) from schilderijen')
        .then(data => {return data})

    const preQuery = await db.manyOrNone(`SELECT * FROM schilderijen ORDER BY id_number ASC LIMIT ${amount} OFFSET ${offset}`)
        .then(data => {return data})
    return {
      total: total[0].count,
      collection: preQuery
    }
  },
  async paintingByID ({id}){
    let queryPainting = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id}`)
    let painting = queryPainting[0]
    let queryPainter = await db.manyOrNone(`SELECT schilder from schilderschilderij where schilderij = ${id}`)
    let painter = queryPainter[0].schilder
    return[{
            id: painting.id,
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
            painter: painter
    }]
  },
  PaintingsByPainter: ({id}) => {
    let query = (`SELECT * from schilderijen, schilder WHERE schilder.id = ${id} AND schilderijen.principalmaker = schilder.name`)
    return db.manyOrNone(query)
  },
  //#endregion
  
  //#region Painters

  paintersAll: () => {
    let query = `SELECT * from schilder`
    return db.manyOrNone(query)
  },
  async paintersAdmin ({page, amount = 12}) {
    let offset = (page - 1) * amount
    
    let painter = await db.manyOrNone (`SELECT * from schilder`)
         .then(data => {return data})

    let totalPainters = await db.manyOrNone (`SELECT COUNT(*) from schilder`)
          .then(data => {return data})
  return{
    total: totalPainters[0].count,
    painterpagination: painter
    }
  },
  paintersPaginated: () => {
    let query = `SELECT * from schilder limit 15`
    return db.manyOrNone(query)
  },
  painterByID: ({id}) => {
    let query = (`SELECT * from schilder where id = ${id}`)
    return db.manyOrNone(query)
  },
  workByPainter: ({id}) => {
    let query = (`SELECT * from schilderijen where principalmaker = ${id}`)
    return db.manyOrNone(query)
  },
  //#endregion
  
  //#region filters
  filterbyperiod:({period}) => {
    let query = (`SELECT * from schilderijen where period = ${period}`)
    return db.manyOrNone(query)
  },
  filterbypriceasc:() => { 
    let query = (`SELECT * from schilderijen ORDER BY price asc`)
    return db.manyOrNone(query)
  },
  filterbypricedesc:() => {
    let query = (`SELECT * from schilderijen ORDER BY price desc`)
    return db.manyOrNone(query)
  },
  filterbytitleasc:()=>{
    return db.manyOrNone(`SELECT * FROM schilderijen ORDER BY title asc`)
  },
  filterbytitledesc:()=>{
    return db.manyOrNone(`SELECT * FROM schilderijen ORDER BY title desc`)
  },
  //#endregion
  
  //#region Search
  //searchfunction 
  async searchbar({query, page, amount = 12}){
    let offset = (page - 1) * amount

    let search = await db.manyOrNone(` SELECT * FROM schilderijen WHERE document_vectors @@ plainto_tsquery('${query}:*') LIMIT ${amount} OFFSET ${offset}`)
        .then(data => {return data})

    let total_search = await db.manyOrNone(`SELECT COUNT(*) FROM schilderijen WHERE document_vectors @@ plainto_tsquery('${query}:*')`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})

    return {
      total: total_search[0].count,
      paintings: search
    }
  },
  //#endregion
  
  //#region Admin
  
  //#region papa & baby tabel
  //Return content of papatabel
  papatabel: () =>{
    return db.manyOrNone(`SELECT * FROM papatabel`)
  },
  //Create tabel and insert data
  async createBabyTabel({tabelnaam, foreignkey, type}){
    if(tabelnaam == ""){
      throw new Error("The provided name is empty!")
    }
    //In order to check if the table already exists
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
                  .then(data => {return data})
                  .catch(err => {throw new Error(`Error while checking if the given table already exists: ${err}`)})
    tableNameCheck.forEach(element => {
      if(element.table == tabelnaam){
        throw new Error(`There already is a Table existing with the name '${tabelnaam}'`)
      }
    })

    //Creating the table
    db.one(`CREATE TABLE ${tabelnaam} (id serial PRIMARY KEY, foreignKey int)`)
        .then()
        .catch()
    
    //Inserting all data into the table
    foreignkey.forEach(element => {
      db.one(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1) RETURNING id`,[element.foreignkey])
      .then()
      .catch()
    })

    //Create ref to the newly created table in the papatabel
    let papaInsert = await db.manyOrNone(`INSERT INTO papatabel(naam,type) VALUES($1, $2) RETURNING id`,[tabelnaam,type])
          .then(data => {return data})
          .catch(err => {throw new Error(err)})
    return `Data has been inserted into row: ${papaInsert[0].id}`
  },  
  //Add content to babytabel
  async addToBabyTabel({id,foreignkey}){
    let table = await db.manyOrNone(`SELECT * from papatabel WHERE id = ${id}`)
    if(!table.length){
      throw new Error(`The specified Table doesn't exist`)
    }
    let tabelnaam = table[0].naam
    foreignkey.forEach(element => {
      db.one(`INSERT INTO ${tabelnaam}(foreignkey) VALUES($1) RETURNING id`,[element.foreignkey])
    })
  },
  //Remove tabel and link in papatabel
  async removeBabyTabel({id}){
    let table = await db.manyOrNone(`SELECT * from papatabel WHERE id = ${id}`)
    if(!table.length){
      throw new Error(`The specified Table doesn't exist`)
    }

    db.one(`DROP TABLE IF EXISTS ${tablename}`)

    //In order to check if the table actually dropped
    let tableNameCheck = await db.manyOrNone(`SELECT relname as table from pg_stat_user_tables where schemaname = 'public'`)
                  .then(data => {return data})
                  .catch(err => {throw new Error(`Error while checking if the table has been dropped: ${err}`)})
    tableNameCheck.forEach(element => {
      if(element.table == tablename){
        throw new Error(`Failed to drop the table: '${tablename}. Please try again later.'`)
      }
    })
    db.one(`DELETE FROM papatabel WHERE id = ${id}`)
    return "The specified table has been removed from the DB"
  },
  //#endregion
  
  //#region alter users
  //Add user
  async selectAllUsers({page, amount}){
    let offset = (page - 1) * amount

    let users = await db.manyOrNone(`SELECT * FROM gebruiker ORDER BY ID ASC LIMIT ${amount} OFFSET ${offset}`)
    .then(data => {
      return data
    })

    let maxusers = await db.manyOrNone(`SELECT COUNT(*) FROM gebruiker`)
    .then(data => {
      return data
    })
    .catch(err => {throw new Error(err)})
    console.log(users)
    console.log(maxusers)

    return {
      total: maxusers[0].count,
      totaluser: users
    }
  },
  async selectUserById({id}){
    return await db.one(`SELECT * FROM gebruiker where id = ${id}`)
            .catch(err => {throw new Error(err)})
  },
  async addUser({name, surname, mail, password, aanhef, adres = null, city = null, postalcode = null, housenumber = null, paymentmethod = null}){
    const saltedPassword = await bcrypt.hash(password,10)
    const user = await db.manyOrNone(`SELECT mail from gebruiker where mail = $1`,[mail])
    if(user.length){
      throw new Error('User with this email already exists')
    }
    return await db.one(`INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, city, postalcode, housenumber, paymentmethod) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, 
    [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode, housenumber, paymentmethod])
    .then(data => {console.log(`\nUser ID: ${data.id}`)
                    return data.id})
      .catch(err => {throw new Error(err)})    
  },
  async alterUser({id, name, surname, mail, password, aanhef, adres, city, postalcode, housenumber, paymentmethod}){
    const user = await db.manyOrNone(`SELECT * from gebruiker where id = ${[id]}`)
    .then(data => {return data})
    .catch(err => {throw new Error(err)})
    if(!user.length){
      throw new Error('No user with the given ID!')
    }
    const saltedPassword = await bcrypt.hash(password,10)
    return await db.one(`UPDATE gebruiker set 
                          name = $1,
                          surname = $2,
                          mail = $3,
                          password = $4,
                          aanhef = $5,
                          adres = $6,
                          city = $7,
                          postalcode = $8,
                          housenumber = $9,
                          paymentmethod = $10
                          WHERE id = ${id}`,
                          [name,surname,mail,saltedPassword,aanhef,adres,city,postalcode,housenumber,paymentmethod])
                        .then(data => {return data})
  },
  async deleteUser({id}){
    let user = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${id}`)
    if(user.length){
      let query = `DELETE from gebruiker WHERE id = ${id}`
      return await db.one(query)
    }else{
      throw new Error(`The specified User doesn't exist!`)
    }
  },
  //#endregion
  
  //#region alter products
  //Add product
  async addProduct({id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, width, height, principalmaker,price,rented=false,painterId}){
    let painting =  await db.one(`INSERT INTO schilderijen(id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, principalmakersproductionplaces, principalmaker, width, height, price,rented) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id_number`, 
    [id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, principalmaker, width, height, price, rented])
    .then(data => {console.log(`\nPainting ID: ${data.id_number}`)
                    return data.id_number})
      .catch(err => {console.error(err)
        throw new Error(err)})

    db.one(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${painterId}, ${painting})`)
    
    return `Painting added to the product list`
  },
  //Alter products
  async alterProduct({id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, prodplace, width, height, principalmaker, price, rented}){
    const prod = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id_number}`)
    .then(data => {return data})
    .catch(err => {console.err(err)
                    throw new Error(err)})
    if(!prod.length){
      throw new Error(`No product with the given ID!`)
    }
    return await db.one(`UPDATE schilderijen set
                          id = $1,
                          title = $2,
                          releasedate = $3,
                          period = $4,
                          description = $5,
                          physicalmedium = $6,
                          amountofpaintings = $7,
                          src = $8,
                          bigsrc = $9,
                          principalmakersproductionplaces = $11,
                          width = $12,
                          height = $13,
                          principalmaker = $14,
                          price = $15,
                          rented = $16
                          WHERE id_number = ${id_number}`,
                          [id,title,releasedate,period,description,physicalmedium,amountofpaintings,src,bigsrc,prodplace,width,height,principalmaker,price,rented])
                        .then(data => {return data})
  },
  //Delete products
  async deleteProduct({id}){
    let prod = await db.manyOrNone(`SELECT * from schilderijen WHERE id_number = ${id}`)
    if(prod.length){      
      let query = `DELETE from schilderijen where id_number = ${id}`
      return await db.one(query)
    }else{
      throw new Error(`The specified Painting doesn't exist!`)
    }
  },
  //#endregion
  
  //#region alter painters
  async addPainter({name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description}){
    const painter = await db.manyOrNone(`SELECT name from schilder where name = $1`,[name])
    if(painter.length){
      throw new Error(`Painter with the given name already exists`)
    }
    return await db.one(`INSERT INTO schilder(name, city, dateofbirth, dateofdeath, placeofdeath, occupation, nationality, headerimage, thumbnail, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`, [name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description])
          .then(data => {return data.id})
          .catch(err => {throw new Error(err)})
  },
  async alterPainter({name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description}){
    const painter = await db.manyOrNone(`SELECT * from schilder WHERE name = ${name}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    if (!painter.length){
      throw new Error(`No painter with the given name exists`)
    }
    return await db.one(`UPDATE schilder set
                          name = $1,
                          city = $2,
                          dateofbirth = $3,
                          dateofdeath = $4,
                          placeofdeath = $5,
                          occupation = $6,
                          nationality = $7,
                          headerimage = $8,
                          thumbnail = $9,
                          description = $10
                          WHERE name = ${name}`,
                          [name, city, dateBirth, dateDeath, placeDeath, occupation, nationality, headerImage, thumbnail, description])
                        .then(data => {return data})
  },
  async deletePainter({name}){
    let painter = await db.manyOrNone(`SELECT * from schilder WHERE name = ${name}`)
    if(painter.length){
      return await db.one(`DELETE from schilder WHERE name = ${name}`)
    }else{
      throw new Error(`The specified Painter doesn't exist!`)
    }
  },
  //#endregion
  //#endregion  

  //#region Random
  faq: () => {
    let query = ('SELECT * from faq')
    return db.manyOrNone(query)
  },
  faqId: (id) => {
    return db.manyOrNone(`SELECT * from faq where id = ${id}`)
  },
  async faqCreate({question, answer}){
    query = await db.one(`INSERT INTO faq(title, body) VALUES($1,$2) RETURNING id`,[question,answer])
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    return `The question has been added to row: ${query.id}`
  },
  async faqDelete({id}){
    let faq = await db.manyOrNone(`SELECT * from faq WHERE id = ${id}`)
    if(faq.length){
      db.one(`DELETE FROM faq WHERE id = ${id}`)
      return `FAQ removed`
    }else{
      throw new Error(`The given ID does not match an existing ID!`)
    }
  },
  dateToString: (givenDate) => {
    let DateDB = givenDate.toString()
    let year = DateDB.slice(11,15)
    let month = DateDB.slice(4,7)
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
    let day = DateDB.slice(8,10)
    return `${year}-${month}-${day}`
  },
  //#endregion
  
  //#region Merging Painter & Paintings
  //Merge schilder met schilderij 1 at a time
  async merge({id_number,id}){
    if(id_number != null != id || id_number != 0 != id){
       return await db.one(`INSERT INTO schilderschilderij (schilder, schilderij) VALUES (${id}, ${id_number})`)
    }
  },
  //Merge all
  async merging(){
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
  },
  //#endregion
  
  //#region User
  async wishlistSelect({userId}){
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${userId}`)
    .then(data => {return data})
    .catch(err => {throw new Error(err)})
    if(!check.length){
      throw new Error(`The provided user doesn't exist`)
    }
    let wishlist = await db.manyOrNone(`SELECT * from wishlist WHERE gebruikerid = ${userId}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    wishlist.forEach(element => {
      element.timestamp = this.dateToString(element.timestamp)
    })
    return wishlist
  },
  async WishlistInsert ({gebruikerId,items,time}){
    let check = await db.manyOrNone(`SELECT id FROM gebruiker WHERE id= ${gebruikerId}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    if(!check.length){
      throw new Error(`The provided user doesn't exist`)
    }
    let current = await db.manyOrNone(`SELECT * FROM wishlist WHERE gebruikerid = ${gebruikerId}`)
    if(current.length){
    db.one(`UPDATE wishlist set items = $1, timestamp = $2 WHERE        gebruikerid = ${gebruikerId}`,[items,time])
      return `The wishlist of user '${gebruikerId}' has been updated`
    }else{
      db.one(`INSERT INTO wishlist(gebruikerid, items, timestamp) VALUES ($1,$2,$3) RETURNING id`,[gebruikerId,items,time])
          .catch(err => {throw new Error(err)})
      return `The wishlist of user '${gebruikerId}' has been created`
    }
  },
  async selectShoppingCart({userId}){
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${userId}`)
    .then(data => {return data})
    .catch(err => {throw new Error(err)})
    if(!check.length){
      throw new Error(`The provided user doesn't exist`)
    }
    let cart = await db.manyOrNone(`SELECT * from shoppingcart WHERE gebruikerid = ${userId}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    cart.forEach(element => {
      element.timestamp = this.dateToString(element.timestamp)
    })
    return cart
  },
  async shoppingCartInsert({gebruikerId,items,time}){
    let check = await db.manyOrNone(`SELECT * from gebruiker WHERE id = ${gebruikerId}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    if(!check.length){
      throw new Error(`The provided user doesn't exist`)
    }
    let current = await db.manyOrNone(`SELECT * from shoppingcart WHERE gebruikerid = ${gebruikerId}`)
    if(current.length){
      db.one(`UPDATE shoppingcart set items = $1, timestamp = $2
              WHERE gebruikerid = ${gebruikerId}`,[items,time])
      return `The shoppingcart of user '${gebruikerId}' has been updated`
    }else{
      db.one(`INSERT INTO shoppingcart(gebruikerid, items, timestamp) 
              VALUES($1,$2,$3) RETURNING id`,[gebruikerId,items,time])
        .catch(err => {throw new Error(err)})
      return `The shoppingcart of user '${gebruikerId}' has been created`
    }
  },  
  async orderListSelect({buyerId}){
    let Lijst = await db.manyOrNone(`SELECT * FROM orderlist
              WHERE buyerid = ${buyerId}`)
        .then(data => {return data})
        .catch(err => {throw new Error(err)})
    Lijst.forEach(element => {
      element.purchasedate = this.dateToString(element.purchasedate)
    });
    return Lijst
  },
  async orderListUpdate({id, buyerId, newStatus}){
    let selection = await db.manyOrNone(`SELECT * from orderlist WHERE id = ${id} AND buyerid = ${buyerId}`)
            .then(data => {console.log(data)
                  return data})
            .catch(err => {throw new Error(err)})
    if(!selection.length){
      throw new Error("The given combination of 'ID' and 'buyerId' doesn't exist")
    }
    db.one(`UPDATE orderlist SET
              status = $1
              WHERE id = $2
              AND buyerid = $3`,[newStatus, id, buyerId])
          .catch(err => {throw new Error(err)})
    return `The status of the selected order has been changed to: ${newStatus}`
  },
  async orderListInsert({buyerId = 166, items, purchaseDate}){
    items.forEach(element => {      
      db.one(`INSERT INTO orderlist(buyerid, items, purchasedate) VALUES($1,$2,$3) RETURNING ID`,[buyerId,element.foreignkey,purchaseDate])
          .then(data => {console.log(`Inserted into row: ${data.id}`)})
          .catch(err => {console.log("oeps"+err+'Oeps')
                throw new Error(err)})
    })
    return "Succes"
  },
  async rentalListInsert({buyerId, items, purchaseDate, rentStart, rentStop}){
    items.forEach(element => {
      db.one(`INSERT INTO rentallist(buyerid,items,purchasedate,rentstart,rentstop) VALUES($1,$2,$3,$3,$4,$5) RETURNING ID`,[buyerId,element.foreignkey,purchaseDate,rentStart,rentStop])
          .then(data => {console.log(`Inserted into row: ${data.id}`)})
          .catch(err => {console.log("oeps"+err+'Oeps')
                throw new Error(err)})
    })
    return "Succes"
  },
  async me (req, res, next) {
    if (!res.headers.authorization) {
      console.log(`\nUser not authenticated!\n`)
      throw new Error('You are not authenticated!')
    }
    var decoded = jwt.verify(
      String(res.headers.authorization).slice(7),
      'E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7'
    );
    console.log(`\nToken: ${String(res.headers.authorization).slice(7)}`)
    console.log(`ID: ${decoded.id}\n`)
    let query = (`SELECT * from gebruiker where id = ${decoded.id}`)
    return await db.manyOrNone(query)
  },
  //user signup
  async checkUser({mail}){
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])
    // Throw an error when a user with the same email exists
    if (user.length) {
      return true;
    } else {
      return false;
    }
  },
  async signup ({ name, surname, mail, password, aanhef, adres, housenumber, city, postalcode, paymentmethod}) {
    // Salt password
    const saltedPassword =  await bcrypt.hash(password, 10)

    // Check if a user with the same email exists
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])

    // Throw an error when a user with the same email exists
    if (user.length) {
      throw new Error ('User with this email already exists')
    }

    // Generate token when insertion is complete

    return await db.one('INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, housenumber, city, postalcode, paymentmethod) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id', 
    [name, surname, mail, saltedPassword, aanhef, adres, housenumber, city, postalcode, paymentmethod])
      .then( data => {
        console.log(`\nUser ID: ${data.id}`)
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
      .catch( err => {
        throw new Error(err)
        console.log(err)
      })
  },
  //user login
  async login ({email, password}) {
    const user = await db.manyOrNone('SELECT * from gebruiker where mail = $1',[email])
                        .then( data => {
                          return data
                        })

    if (!user) {
      throw new Error('No user with that email')
    }

    const valid = await bcrypt.compare(password, user[0].password)

    if (!valid) {
      throw new Error('Incorrect password')
    }

    console.log(`\nUser ID: ${user[0].id}`)

    let token = jwt.sign(
      { id: user[0].id },
      "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
      { expiresIn: '1d' }
    )
    console.log(`Token: ${token}`)

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