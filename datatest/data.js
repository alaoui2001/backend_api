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

    // Insert data into tables
    const insertUserQuery = `
        INSERT INTO users (firstname, lastname, email, password)
        VALUES
        ('John', 'Doe', 'johndoe@example.com', 'password123'),
        ('Jane', 'Smith', 'janesmith@example.com', 'secret'),
        ('Mike', 'Johnson', 'mikejohnson@example.com', 'pass123'),
        ('Emily', 'Davis', 'emilydavis@example.com', 'test123')
    
    `;

    const insertSolarPanelQuery = `
        INSERT INTO solar_panels (etat, marque, model, capacity, efficiency, width, height, installationDate)
        VALUES
        ('Active', 'Brand A', 'Model X', 100, 0.85, 5.5, 3.2, '2022-01-10'),
        ('Inactive', 'Brand B', 'Model Y', 150, 0.75, 6.0, 3.5, '2021-11-20'),
        ('Active', 'Brand C', 'Model Z', 200, 0.90, 5.8, 3.0, '2023-02-15'),
        ('Active', 'Brand D', 'Model Z', 200, 0.90, 5.8, 3.0, '2023-02-15'),
        ('Active', 'Brand E', 'Model ZX', 200, 0.90, 5.8, 3.0, '2023-09-15'),
        ('Active', 'Brand F', 'Model ZL', 200, 0.90, 5.8, 3.0, '2023-08-15'),
        ('Active', 'Brand G', 'Model ZA', 200, 0.90, 5.8, 3.0, '2023-03-15'),
        ('Active', 'Brand H', 'Model ZD', 200, 0.90, 5.8, 3.0, '2023-05-15'),
        ('Active', 'Brand I', 'Model ZK', 200, 0.90, 5.8, 3.0, '2023-07-15')
        -- Add more solar panels as needed
    `;

    const insertBattrieQuery = `
        INSERT INTO batteries (model, capacity, voltage, etat, network_seller, network_buyer)
        VALUES
        ('Battery1', 500, 12, 'Active', 1, 2),
        ('Battery2', 750, 24, 'Active', 3, 1),
        ('Battery3', 1000, 36, 'Active', 2, 3)
        -- Add more batteries as needed
    `;

    const insertProductionQuery = `
    INSERT INTO productions (productionDate, quantity, battrie_id, solarPanel_id)
    VALUES
    ('2022-01-15', 100, 1, NULL), -- Production related to Battery1
    ('2021-12-20', 150, 2, NULL), -- Production related to Battery2
    ('2023-03-05', 200, 3, NULL), -- Production related to Battery3
    ('2022-02-10', 120, NULL, 1), -- Production related to SolarPanel1
    ('2022-03-20', 90, NULL, 2)   -- Production related to SolarPanel
    `;

    const insertConsommationQuery = `
    INSERT INTO consommations ( consommationDate, quantity, battrie_id, solarPanel_id)
    VALUES
    ( '2022-01-15', 50, 1, NULL), -- Consumption related to Battery1
    ( '2021-12-20', 75, 2, NULL), -- Consumption related to Battery2
    ( '2023-03-05', 34, 3, NULL), -- Consumption related to Battery3
    ('2022-02-10', 60, NULL, 1), -- Production related to SolarPanel1
    ('2022-03-20', 30, NULL, 2)   -- Production related to SolarPanel

 
`;

    const insertNetworkPublicQuery = `
        INSERT INTO network_public (name)
        VALUES
        ('Network1'),
        ('Network2'),
        ('Network3')
        -- Add more networks as needed
    `;

    // Execute queries to insert data
    connection.query(insertUserQuery, (err, result) => {
        if (err) throw err;
        console.log('Users inserted');
    });
    connection.query(insertNetworkPublicQuery, (err, result) => {
        if (err) throw err;
        console.log('NetworkPublic inserted');
    });
    connection.query(insertSolarPanelQuery, (err, result) => {
        if (err) throw err;
        console.log('Solar panels inserted');
    });

    connection.query(insertBattrieQuery, (err, result) => {
        if (err) throw err;
        console.log('Batteries inserted');
    });

    connection.query(insertProductionQuery, (err, result) => {
        if (err) throw err;
        console.log('Productions inserted');
    });

    connection.query(insertConsommationQuery, (err, result) => {
        if (err) throw err;
        console.log('Consommations inserted');
    });

    

    // Close the MySQL connection
    connection.end((err) => {
        if (err) throw err;
        console.log('MySQL connection closed');
    });
});
