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
    let query = 'SELECT * from schilderijen limit 15'
    return db.manyOrNone(query)
  },
  collectionSearch: () => {
    let query = 'SELECT * from schilderijen'
    return db.manyOrNone(query)
  },
  async paintingOrderedByPagination ({ page }) {
    let offset = (page - 1) * 10
    // let query = (`SELECT * FROM schilderijen LIMIT 10 OFFSET ${offset}`)

    const total = await db.manyOrNone('SELECT COUNT(*) from schilderijen')
                        .then( data => {
                          return data
                        })

    const preQuery = await db.manyOrNone(`SELECT * FROM schilderijen LIMIT 10 OFFSET ${offset}`)
                        .then( data => {
                          return data
                        })
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
    let query = (`SELECT * from schilderijen, schilder WHERE schilderijen.id_number = ${id} AND schilderijen.principalmaker = schilder.name`)
    return db.manyOrNone(query)
  },
  //#endregion
  //#region Painters
  paintersAll: ()=>{
    let query = `SELECT * from schilder`
    return db.manyOrNone(query)
  },
  painters: () => {
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
  //#region filters
  filterbyperiod:({period}) => {
    let query = (`SELECT * from schilderijen where period = ${period}`)
    return db.manyOrNone(query)
  },
  //#endregion
  faq: () => {
    let query = ('SELECT * from faq')
    return db.manyOrNone(query)
  },
  //#region Admin
  //#region papa & baby tabel
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
  async addUser({name, surname, mail, password, aanhef, adres = null, city = null, postalcode = null, housenumber = null}){
    const saltedPassword = await bcrypt.hash(password,10)
    const user = await db.manyOrNone(`SELECT mail from gebruiker where mail = $1`,[mail])
    if(user.length){
      throw new Error('User with this email already exists')
    }
    return await db.one(`INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, city, postalcode, housenumber) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, 
    [name, surname, mail, saltedPassword, aanhef, adres, city, postalcode, housenumber])
    .then(data => {console.log(`\nUser ID: ${data.id}`)
                    return data.id})
      .catch(err => {throw new Error(err)})    
  },
  //Alter user
  async alterUser({id, name, surname, mail, password, aanhef, adres, city, postalcode, housenumber}){
    const user = await db.manyOrNone(`SELECT * from gebruiker where id = ${[id]}`)
    .then(data => {return data})
    .catch(err => {throw new Error(err)})
    if(user[0].id != id){
      throw new Error('No user with that ID!')
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
                          housenumber = $9
                          WHERE id = ${id}`,
                          [name,surname,mail,saltedPassword,aanhef,adres,city,postalcode,housenumber])
                        .then(data => {return data})
  },
  //Delete user
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
  async addProduct({id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, plaquedescdutch, prodplace, width, height, principalmaker,price}){
    return await db.one(`INSERT INTO schilderijen(id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, plaquedescriptiondutch, principalmakersproductionplaces, principalmaker, width, height, price) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id_number`, 
    [id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, plaquedescdutch, prodplace, principalmaker, width, height, price])
    .then(data => {console.log(`\nPainting ID: ${data.id_number}`)
                    return data.id_number})
      .catch(err => {console.error(err)
        throw new Error(err)})
  },
  //Alter products
  async alterProduct({id_number, id, title, releasedate, period, description, physicalmedium, amountofpaintings, src, bigsrc, plaquedescdutch, prodplace, width, height, principalmaker, price}){
    const prod = await db.manyOrNone(`SELECT * from schilderijen where id_number = ${id_number}`)
    .then(data => {return data})
    .catch(err => {console.err(err)
                    throw new Error(err)})
    if(prod[0].id_number != id_number){
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
                          plaquedescriptiondutch = $10,
                          principalmakersproductionplaces = $11,
                          width = $12,
                          height = $13,
                          principalmaker = $14,
                          price = $15
                          WHERE id_number = ${id_number}`,
                          [id,title,releasedate,period,description,physicalmedium,amountofpaintings,src,bigsrc,plaquedescdutch,prodplace,width,height,principalmaker,price])
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
  //#endregion
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
  //#region Merging Painter & Paintings
  //Merge schilder met schilderij 1 at a time
  async merge({id_number,id}){
    // console.log(`schilderijen = ${id_number} & schilder = ${id}`)
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
    //                                        .then( data => {return data})
    //   // console.log(schilderNum[0].id)
    //   // Commented for safety reasons, only uncomment when the entire collection of painters is to be inserted
    //   await db.one(`INSERT INTO schilderschilderij (schilder, schilderij) values(${schilderNum[0].id}, ${i}) RETURNING id`).then(data => {return data})  
    //   console.log(`Insert executed`)  
    // }
    console.log("Commented for safety reasons, only uncomment when the entire collection of painters is to be inserted")
  },
  //#endregion
  //#region User
  //user signup
  async checkUser({ mail }){
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])

    // Throw an error when a user with the same email exists
    if (user.length) {
      return true;
    } else {
      return false;
    }
  },
  async signup ({ name, surname, mail, password, aanhef, adres, housenumber, city, postalcode}) {
    // Salt password
    const saltedPassword =  await bcrypt.hash(password, 10)

    // Check if a user with the same email exists
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [mail])

    // Throw an error when a user with the same email exists
    if (user.length) {
      throw new Error ('User with this email already exists')
    }

    // Generate token when insertion is complete

    return await db.one('INSERT INTO gebruiker(name, surname, mail, password, aanhef, adres, housenumber, city, postalcode) \
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id', 
    [name, surname, mail, saltedPassword, aanhef, adres, housenumber, city, postalcode])
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
      city: user[0].city,
      postalcode: user[0].postalcode,
      token: token
    }

    return userWithToken
  }
  //#endregion
}

module.exports = {
  root
}