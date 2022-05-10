const mysql = require("mysql");
const db = mysql.createConnection({
  host: process.env.local_DB_host,
  port: process.env.local_DB_port,
  user: process.env.local_DB_user,
  password: process.env.local_DB_password,
  database: process.env.local_DB,
  charset: "utf8mb4",
});

const str = "2022.05.01- 2022.05.15";

module.exports = db;
