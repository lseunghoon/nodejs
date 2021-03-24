var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tmdgns0070',
    database: 'testlsh'
  });
  db.connect();

  module.exports = db; //하나일 경우
  