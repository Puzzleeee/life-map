const mysql = require('mysql2')

var pool = mysql.createPool({
    multipleStatements: true,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'orbital_development',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})  

const crud = require('./crud.js')(pool)

const user_auth = require('./db_includes/user_auth.js')(crud)
const markers = require('./db_includes/markers.js')(crud)
const diary = require('./db_includes/diary_entries.js')(crud)

module.exports = {...user_auth, ...markers, ...diary}