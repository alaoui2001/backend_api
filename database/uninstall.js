const mysql = require('mysql');

// MySQL connection settings
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'backend_api', // Replace with your desired database name
    port: '3306', // Default MySQL port
});

// Connect to MySQL server
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server');

    // Drop tables one by one
    const dropTablesQueries = [
        'DROP TABLE IF EXISTS energies;',
        'DROP TABLE IF EXISTS transactions;',
        'DROP TABLE IF EXISTS consommations;',
        'DROP TABLE IF EXISTS productions;',
        'DROP TABLE IF EXISTS solar_panels;',
        'DROP TABLE IF EXISTS batteries;',
        'DROP TABLE IF EXISTS network_public;',
        'DROP TABLE IF EXISTS users;'
    ];

    // Execute each drop table query
    dropTablesQueries.forEach((query) => {
        connection.query(query, (err, result) => {
            if (err) throw err;
            console.log('Table dropped successfully');
        });
    });

    // Close the MySQL connection
    connection.end((err) => {
        if (err) throw err;
        console.log('MySQL connection closed');
    });
});
