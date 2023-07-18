var mysql = require("mysql2");
require('dotenv').config();


var conn = mysql.createConnection({
  host:"db4free.net",
  user:"sql10617338",
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 3306
});
conn.connect((err) => {
  if (!err) {
    console.log("established connection");
  } else {
    console.log("fail connection");
    console.log("error: " + err);
  }
});


module.exports = conn;
