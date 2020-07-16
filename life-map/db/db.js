const mysql = require("mysql2");

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require("dotenv");
  dotenv.config({ path: "./config/config.env" });
}

var pool = mysql.createPool({
  multipleStatements: true,
  host: `${process.env.DB_HOST}`,
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_DATABASE}`,
  waitForConnections: true,
  connectionLimit: 9,
  queueLimit: 0,
});

const crud = require("./crud.js")(pool);

const user_auth = require("./db_includes/user_auth.js")(crud);
const markers = require("./db_includes/markers.js")(crud);
const diary = require("./db_includes/diary_entries.js")(crud);
const photos = require("./db_includes/photos.js")(crud);
const social = require("./db_includes/social.js")(crud);

module.exports = { ...user_auth, ...markers, ...diary, ...photos, ...social };
