var mysql = require('mysql');

var db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
  });
  db.connect();

  module.exports = db; //하나일 경우
  