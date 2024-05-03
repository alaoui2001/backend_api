const db = require('../config/connection'); // Assuming your database connection module is named 'connection'

// Sample data for solar panels
const solarPanelsData = [
    { id: 1, etat: 'active', marque: 'SolarTech', model: 'ST-100', capacity: 100, efficiency: 0.85, width: 1.5, height: 2, installationDate: '2022-01-01', battrie_id: 1 },
    { id: 2, etat: 'active', marque: 'SunPower', model: 'SP-200', capacity: 200, efficiency: 0.88, width: 1.8, height: 2.2, installationDate: '2022-02-01', battrie_id: 2 },
    { id: 3, etat: 'active', marque: 'EcoSolar', model: 'ES-150', capacity: 150, efficiency: 0.82, width: 1.7, height: 2.1, installationDate: '2022-03-15', battrie_id: 3 },
    { id: 4, etat: 'active', marque: 'GreenEnergy', model: 'GE-120', capacity: 120, efficiency: 0.75, width: 1.4, height: 1.8, installationDate: '2022-04-20', battrie_id: 4 },
    { id: 5, etat: 'active', marque: 'SunBeam', model: 'SB-180', capacity: 180, efficiency: 0.90, width: 1.9, height: 2.4, installationDate: '2022-05-10', battrie_id: 5 },
];

// Sample data for batteries
const batteriesData = [
    { id: 1, model: 'Battery Model 1', capacity: 500, voltage: 48, etat: 'Active', capacityMax: 1000 },
    { id: 2, model: 'Battery Model 2', capacity: 800, voltage: 48, etat: 'Active', capacityMax: 1500 },
    { id: 3, model: 'Battery Model 3', capacity: 600, voltage: 48, etat: 'Active', capacityMax: 1200 },
    { id: 4, model: 'Battery Model 4', capacity: 700, voltage: 48, etat: 'Active', capacityMax: 1400 },
    { id: 5, model: 'Battery Model 5', capacity: 900, voltage: 48, etat: 'Active', capacityMax: 1800 },
];

const transactionsData = [
    { id: 1, price: 2000, transactionDate: '2022-01-15', type: 'Selling', network_id: 1 },
    { id: 2, price: 1500, transactionDate: '2022-02-20', type: 'Buying', network_id: 2 },
    { id: 3, price: 1800, transactionDate: '2022-03-10', type: 'Selling', network_id: 1 },
    { id: 4, price: 1200, transactionDate: '2022-04-05', type: 'Buying', network_id: 2 },
    { id: 5, price: 2500, transactionDate: '2022-05-20', type: 'Selling', network_id: 1 },
];

// Sample data for users
const usersData = [
    { id: 1, firstname: 'John', lastname: 'Doe', password: 'password1', email: 'john.doe@example.com' },
    { id: 2, firstname: 'Jane', lastname: 'Smith', password: 'password2', email: 'jane.smith@example.com' },
    { id: 3, firstname: 'Michael', lastname: 'Johnson', password: 'password3', email: 'michael.johnson@example.com' },
    { id: 4, firstname: 'Emily', lastname: 'Brown', password: 'password4', email: 'emily.brown@example.com' },
    { id: 5, firstname: 'William', lastname: 'Davis', password: 'password5', email: 'william.davis@example.com' },
];

// Sample data for energies
const energiesData = [
    { id: 1, quantity: 100, battrie_id: 1, solarPanel_id: 1, transaction_id: 1 },
    { id: 2, quantity: 150, battrie_id: 2, solarPanel_id: 2, transaction_id: 2 },
    { id: 3, quantity: 200, battrie_id: 3, solarPanel_id: 3, transaction_id: 3 },
    { id: 4, quantity: 250, battrie_id: 4, solarPanel_id: 4, transaction_id: 4 },
    { id: 5, quantity: 300, battrie_id: 5, solarPanel_id: 5, transaction_id: 5 },
];
const networkPublicData = [
    { id: 1, name: 'Network A' },
    { id: 2, name: 'Network B' },
];
async function insertSampleData() {
    try {
           // Insert sample data for public networks
           await db.query('INSERT INTO network_public (id, name) VALUES ?', [networkPublicData.map(network => Object.values(network))]);
       
        // Insert sample data for batteries
        await db.query('INSERT INTO batteries (id, model, capacity, voltage, etat, capacityMax) VALUES ?', [batteriesData.map(battery => Object.values(battery))]);
 // Insert sample data for solar panels
 await db.query('INSERT INTO solar_panels (id, etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id) VALUES ?', [solarPanelsData.map(panel => Object.values(panel))]);

        // Insert sample data for transactions
        await db.query('INSERT INTO transactions (id, price, transactionDate, type,network_id) VALUES ?', [transactionsData.map(transaction => Object.values(transaction))]);

        // Insert sample data for users
        await db.query('INSERT INTO users (id, firstname, lastname, password, email) VALUES ?', [usersData.map(user => Object.values(user))]);

        // Insert sample data for energies
        await db.query('INSERT INTO energies (id, quantity, battrie_id, solarPanel_id, transaction_id) VALUES ?', [energiesData.map(energy => Object.values(energy))]);

        console.log('Sample data inserted successfully.');
    } catch (err) {
        console.error('Error inserting sample data:', err);
    } finally {
        db.end(); // Close the database connection
    }
}

// Call the function to insert sample data
insertSampleData();
