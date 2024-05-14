const db = require('../config/connection'); // Assuming your database connection module is named 'connection'

// Sample data for solar panels
const solarPanelsData = [
    { id: 1, etat: 'actif', marque: 'SolarTech', model: 'ST-100', capacity: 100, efficiency: 0.85, width: 1.5, height: 2, installationDate: '2022-01-01', battrie_id: 1 }

];

// Sample data for batteries
const batteriesData = [
    { id: 1, model: 'Battery Model 1', capacity: 400, voltage: 48, etat: 'actif', capacityMax: 1000 }
  
];
let productiondata=[]
let consommationdata=[]
let energiesData=[]
let capacities=[]
let date = new Date('2024-05-01')
let j=0
for(i=0;i<1000;i++){
    let production=Math.floor(100+ Math.random() * 1000);
    let consommation=Math.floor(100+ Math.random() * 1000);
   
    
    capacities[i]={capacitydate:date.toISOString().split('T')[0],capacity:batteriesData[0].capacity}
    productiondata[i]={productiondate:date.toISOString().split('T')[0],quantity:production,solarPanel_id:1}
    if(production>=consommation){
        consommationdata[i]={consommationdate:date.toISOString().split('T')[0],quantity:consommation,battrie_id:null,solarPanel_id:1}
        surplus=production-consommation
        if(surplus> batteriesData[0].capacityMax-batteriesData[0].capacity){
            batteriesData[0].capacity=batteriesData[0].capacityMax

            energiesData[j]={  quantity:surplus-( batteriesData[0].capacityMax-batteriesData[0].capacity), battrie_id: 1,  price: 1, transactionDate: date.toISOString().split('T')[0], type: "selling",network_id:1}
            j++;
        }
        
           else
           batteriesData[0].capacity+=surplus
    }

    else{
        if(consommation>=batteriesData[0].capacity){
            consommationdata[i]={consommationdate:date.toISOString().split('T')[0],quantity:consommation,battrie_id:1,solarPanel_id:null}
          energiesData[j]={  quantity:consommation-batteriesData[0].capacity, battrie_id: 1,  price: 1, transactionDate: date.toISOString().split('T')[0], type: "buying",network_id:1}
         batteriesData[0].capacity=0
         j++;
        }
        else{
            consommationdata[i]={consommationdate:date.toISOString().split('T')[0],quantity:consommation,battrie_id:1,solarPanel_id:null}
            batteriesData[0].capacity-=consommation
        }
    }
    date.setDate(date.getDate() + 1);
 
}
 
// Sample data for users
// const usersData = [
//     { id: 1, firstname: 'John', lastname: 'Doe', password: 'password1', email: 'john.doe@example.com' },
//     { id: 2, firstname: 'Jane', lastname: 'Smith', password: 'password2', email: 'jane.smith@example.com' },
//     { id: 3, firstname: 'Michael', lastname: 'Johnson', password: 'password3', email: 'michael.johnson@example.com' },
//     { id: 4, firstname: 'Emily', lastname: 'Brown', password: 'password4', email: 'emily.brown@example.com' },
//     { id: 5, firstname: 'William', lastname: 'Davis', password: 'password5', email: 'william.davis@example.com' },
// ];

// Sample data for energies

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

        
        // Insert sample data for users
       // await db.query('INSERT INTO users (id, firstname, lastname, password, email) VALUES ?', [usersData.map(user => Object.values(user))]);
       await db.query('INSERT INTO productions ( productionDate,quantity,solarPanel_id ) VALUES ?', [productiondata.map(production => Object.values(production))]);
       await db.query('INSERT INTO consommations ( consommationDate,quantity, battrie_id,solarPanel_id ) VALUES ?', [consommationdata.map(consommation => Object.values(consommation))]);

       // Insert sample data for energies
        await db.query('INSERT INTO energies ( quantity, battrie_id, price, transactionDate, type,network_id) VALUES ?', [energiesData.map(energy => Object.values(energy))]);
        await db.query('INSERT INTO capacities ( capacityDate,capacity ) VALUES ?', [capacities.map(energy => Object.values(energy))]);

        console.log('Sample data inserted successfully.');
    } catch (err) {
        console.error('Error inserting sample data:', err);
    } finally {
        db.end(); // Close the database connection
    }
}

// Call the function to insert sample data
insertSampleData();
