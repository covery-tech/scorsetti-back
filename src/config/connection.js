var mysql = require("mysql2");
require('dotenv').config();


var conn = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 3306
});
var conn2 = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 3306
}).promise();

conn.connect((err) => {
  if (!err) {
    console.log("established connection");
  } else {
    console.log("fail connection");
    console.log("error: " + err);
  }
});


module.exports = {
  conn,
  conn2
};
