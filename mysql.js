var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'tmdgns0070',
    database: 'testlsh'
});

connection.connect();

connection.query('select * from topic_test', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});

connection.end();