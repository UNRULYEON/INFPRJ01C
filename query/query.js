const pgp = require('pg-promise')(/*options*/)
const db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var root = {
  status: () => {
    return 200
  },
  collection: () => {
    let query = 'SELECT * from schilderijen limit 3'
    return db.manyOrNone(query)
  },
  collectionSearch: () => {
    let query = 'SELECT * from schilderijen'
    return db.manyOrNone(query)
  },
  paintingOrderedByPagination: ({ page }) => {
    let offset = (page - 1) * 10
    let query = (`SELECT * FROM schilderijen LIMIT 10 OFFSET ${offset}`)
    return db.manyOrNone(query)
  },
  paintingByID: ({id}) => {
    let query = (`SELECT * from schilderijen where id_number = ${id}`)
    console.log(query)
    return db.manyOrNone(query)
  },
  painters: () => {
    let query = 'SELECT * from schilder limit 15'
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
  faq: () => {
    let query = ('SELECT * from faq')
    return db.manyOrNone(query)
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

  async signup ({ name, surname, email, password }) {
    // Salt password
    const saltedPassword =  await bcrypt.hash(password, 10)

    // Check if a user with the same email exists
    const user = await db.manyOrNone('SELECT mail from gebruiker where mail = $1', [email])

    // Throw an error when a user with the same email exists
    if (user.length) {
      throw new Error ('User with this email already exists')
    }

    // Generate token when insertion is complete
    let token = await db.one('INSERT INTO gebruiker(name, surname, mail, password) VALUES($1, $2, $3, $4) RETURNING id', [name, surname, email, saltedPassword])
      .then( data => {
        console.log(`\nUser ID: ${data.id}`)

        return jwt.sign(
          { id: data.id },
          "E28BA7D908327F1F8F08E396D60DC6FBCDB734387C2C08FCD2CF8E4C09B36AB7",
          { expiresIn: '1d' }
        )
      })
      .catch( err => {
        throw new Error(err)
      })

    // Return token to client
    console.log(`Token: ${token}\n`)
    return token;
  },
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

    console.log(`Token: ${token}\n`);
    return token
  }
}

module.exports = {
  root
}