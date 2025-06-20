const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'textbook_marketplace'
});

module.exports = db;