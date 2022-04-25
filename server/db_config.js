const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.local_DB_host,
  port: process.env.local_DB_port,
  user: process.env.local_DB_user,
  password: process.env.local_DB_password,
  database: 'saemoi',
  charset: 'utf8mb4',
});

module.exports = db;
