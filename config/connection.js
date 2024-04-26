const mysql = require('mysql');
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "backend_api",
});

conn.connect();

module.exports = conn;