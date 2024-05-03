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

    // Create tables based on models
    const createSolarPanelTableQuery = `
        CREATE TABLE IF NOT EXISTS solar_panels (
            id INT AUTO_INCREMENT PRIMARY KEY,
            etat VARCHAR(255),
            marque VARCHAR(255),
            model VARCHAR(255),
            capacity FLOAT,
            efficiency FLOAT,
            width FLOAT,
            height FLOAT,
            installationDate DATE,
            battrie_id INT, -- Foreign key referencing Battrie
            FOREIGN KEY (battrie_id) REFERENCES batteries(id),
            UNIQUE (battrie_id)
        )
    `;
    const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255),
            lastname VARCHAR(255),
            password VARCHAR(255),
            email VARCHAR(255)
           
        )
    `;

    const createBattrieTableQuery = `
        CREATE TABLE IF NOT EXISTS batteries (
            id INT AUTO_INCREMENT PRIMARY KEY,
            model VARCHAR(255),
            capacity FLoat,
            capacityMax float,
            voltage FLOAT,
            etat VARCHAR(255)
           
        )
    `;

    const createProductionTableQuery = `
        CREATE TABLE IF NOT EXISTS productions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            productionDate DATE,
            quantity float,
          
            solarPanel_id INT,
            FOREIGN KEY(solarPanel_id) REFERENCES solar_panels(id)
        )
    `;

    const createConsommationTableQuery = `
        CREATE TABLE IF NOT EXISTS consommations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            
            consommationDate DATE,
            quantity float,
            battrie_id INT, -- Foreign key referencing Battrie
            solarPanel_id INT, -- Foreign key referencing SolarPanel
            FOREIGN KEY (battrie_id) REFERENCES batteries(id),
            FOREIGN KEY (solarPanel_id) REFERENCES solar_panels(id),
            UNIQUE (battrie_id,consommationDate),
            UNIQUE (solarPanel_id,consommationDate)
        )
    `;

    const createNetworkPublicTableQuery = `
        CREATE TABLE IF NOT EXISTS network_public (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255)
        )
    `;
    const createEnergiesTableQuery = `
    CREATE TABLE IF NOT EXISTS energies (
        id INT AUTO_INCREMENT PRIMARY KEY,
         quantity float ,
         battrie_id INT, -- Foreign key referencing Battrie
         solarPanel_id INT, -- Foreign key referencing SolarPanel
         FOREIGN KEY (battrie_id) REFERENCES batteries(id),
         FOREIGN KEY (solarPanel_id) REFERENCES solar_panels(id),
         transaction_id int,
         FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    )
`;
    const createTransactionsTableQuery = `
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        price Float,
        transactionDate DATE,
        network_id int,
        type varchar(255), -- type selling or buying
        FOREIGN KEY (network_id) REFERENCES network_public(id)
    )
`;

    // Execute queries to create tables
    connection.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log('User table created');
    });
    connection.query(createNetworkPublicTableQuery, (err, result) => {
        if (err) throw err;
        console.log('NetworkPublic table created');
    });
    connection.query(createBattrieTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Battrie table created');
    });

    connection.query(createSolarPanelTableQuery, (err, result) => {
        if (err) throw err;
        console.log('SolarPanel table created');
    });

   
    connection.query(createProductionTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Production table created');
    });

    connection.query(createConsommationTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Consommation table created');
    });
    connection.query(createTransactionsTableQuery, (err, result) => {
        if (err) throw err;
        console.log('transaction table created');
    });
    connection.query(createEnergiesTableQuery, (err, result) => {
        if (err) throw err;
        console.log('energie table created');
    });

    // Close the MySQL connection
    connection.end((err) => {
        if (err) throw err;
        console.log('MySQL connection closed');
    });
});
