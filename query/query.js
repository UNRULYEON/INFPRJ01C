var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://projectc:pc@188.166.94.83:5432/project_dev')

var root = {
  hello: () => {
    return 'Hello World!'
  },
  collection: () => {
    let query = 'SELECT * from schilderijen limit 3'
    return db.manyOrNone(query)
  },
  paintingByID: ({id}) => {
    let query = (`SELECT * from schilderijen where id_number = ${id}`)
    return db.manyOrNone(query)
  },
  painters: () => {
    let query = 'SELECT * from schilder limit 15'
    return db.manyOrNone(query)
  },
  painterByID: ({id}) => {
    let query = (`SELECT * from schilder where id_number = ${id}`)
    return db.manyOrNone(query)
  },
  workByPainter: ({id}) => {
    let query = (`SELECT * from schilderijen where principalmaker = ${id}`)
    return db.manyOrNone(query)
  }
}

module.exports = {
  root
}