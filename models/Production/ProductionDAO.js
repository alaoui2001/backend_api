const db = require('../../config/connection');
const Production = require('../Production/Production');
const ConsommationDAO = require('../Consommation/ConsommationDAO');
const BattrieDAO = require('../Battrie/BattrieDAO');
const SolarPanelDAO = require('../SolarPanel/SolarPanelDAO');
class ProductionDAO {
    static createProduction(production) {
        return new Promise((resolve, reject) => {
            const { productionDate, quantity, solarPanel_id } = production;
            let insertId = 0;

            db.query(
                'INSERT INTO productions (productionDate, quantity, solarPanel_id) VALUES (?, ?, ?)',
                [productionDate, quantity, solarPanel_id],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        insertId = results.insertId;

                        ConsommationDAO.getConsommationByDateAndSolarId(productionDate, solarPanel_id)
                            .then( async consommation =>  {
                                if (consommation) {
                                    const newCapacity = quantity - consommation.quantity;
                                    let battrieId=await BattrieDAO.getBattrieBySolarPanelId(solarPanel_id)
                                    BattrieDAO.updateBatteryCapacity(battrieId, newCapacity)
                                        .then(updatedSolarPanel => {
                                            if (!updatedSolarPanel) {
                                                reject('Failed to update solar panel capacity');
                                            } else {
                                                resolve(insertId);
                                            }
                                        })
                                        .catch(err => reject(err));
                                } else {
                                    resolve(insertId);
                                }
                            })
                            .catch(err => reject(err));
                    }
                }
            );
        });
    }
    static async getAverageProductionByMonth(year) {
        return new Promise((resolve, reject) => {
            const query = `
            select AVG(a.totalQuantity) as averageProduction from (SELECT MONTH(productionDate) as month,
            YEAR(productionDate) as year,
            SUM(quantity) as totalQuantity
     FROM productions
     WHERE YEAR(productionDate) = ?
     GROUP BY YEAR(productionDate), MONTH(productionDate) ) as a;
            `;
            db.query(query, [year], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    // Calculate the average production quantity per month
                  
                    resolve(results);
                }
            });
        });
    }
    static getProductionByDateAndSolarId(productionDate, solarPanelId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productions WHERE productionDate = ? AND solarPanel_id = ?';
            db.query(query, [productionDate, solarPanelId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const productionData = results[0];
                        const production = new Production(
                            productionData.id,
                            productionData.productionDate,
                            productionData.quantity,
                            productionData.solarPanel_id,
                            productionData.battrie_id
                        );
                        resolve(production);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static getAllProductions() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productions';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching all productions:', err);
                    reject(err);
                } else {
                    // Map the results to Production objects
                    const productions = results.map(productionData => {
                        return new Production(
                            productionData.id,
                            productionData.productionDate,
                            productionData.quantity,
                            productionData.solarPanel_id,
                            productionData.battrie_id
                        );
                    });
                    resolve(productions);
                }
            });
        });
    }

    static getProductionById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM productions WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const productionData = results[0];
                        const production = new Production(
                            productionData.id,
                            productionData.productionDate,
                            productionData.quantity,
                            productionData.solarPanel_id,
                            productionData.battrie_id
                        );
                        resolve(production);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static updateProduction(production) {
        return new Promise((resolve, reject) => {
            const { id, productionDate, quantity, solarPanel_id } = production;
            db.query(
                'UPDATE productions SET productionDate = ?, quantity = ?, solarPanel_id = ?  WHERE id = ?',
                [productionDate, quantity, solarPanel_id, id],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.affectedRows > 0);
                    }
                }
            );
        });
    }

    static deleteProduction(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM productions WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    static getProductionsBySolarId(solarId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productions WHERE solarPanel_id = ?';
            db.query(query, [solarId], (err, results) => {
                if (err) {
                    console.error('Error fetching productions by solar panel ID:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static reportProductionByDayForSolarPanelsWithRange(startDate = null, endDate = null) {
        let query = `
            SELECT productionDate, SUM(quantity) as totalQuantity 
            FROM productions 
            WHERE solarPanel_id IS NOT NULL -- Only consider productions related to solar panels
        `;
        const params = [];

        if (startDate && endDate) {
            query += ' AND productionDate BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' GROUP BY productionDate';

        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) {
                    console.error('Error generating production report for solar panels with range:', err);
                    reject(err);
                } else {
                    let productionArray=results
                    let lowestDate = new Date(productionArray[0].productionDate);
let highestDate = new Date(productionArray[0].productionDate);
productionArray.forEach(obj => {
    const currentDate = new Date(obj.productionDate);
    if (currentDate < lowestDate) {
        lowestDate = currentDate;
    }
    if (currentDate > highestDate) {
        highestDate = currentDate;
    }
});

// Generate an array of dates between the lowest and highest dates
const dateArray = [];
let currentDate = new Date(lowestDate);
while (currentDate <= highestDate) {
    dateArray.push(currentDate.toISOString().slice(0, 10));
    currentDate.setDate(currentDate.getDate() + 1);
}

// Create a new array with objects for each date, setting totalQuantity to 0 for missing dates
const newArray = dateArray.map(date => {
    const existingEntry = productionArray.find(obj =>
         String(obj.productionDate.toISOString()).slice(0,10) === date);
    return {
        "productionDate": date,
        "totalQuantity": existingEntry ? existingEntry.totalQuantity : 0
    };
});
                    
                    resolve(newArray);
                }
            });
        });
    }

   static getSumProductionForAllSolarPanels(timeframe) {
        return new Promise((resolve, reject) => {
            let query;
            switch (timeframe) {
                case 'day':
                    query = `
                        SELECT SUM(quantity) as totalProduction 
                        FROM productions 
                        WHERE productionDate = CURDATE()
                    `;
                    break;
                case 'month':
                    query = `
                        SELECT SUM(quantity) as totalProduction 
                        FROM productions 
                        WHERE MONTH(productionDate) = MONTH(CURRENT_DATE()) 
                            AND YEAR(productionDate) = YEAR(CURRENT_DATE())
                    `;
                    break;
                case 'year':
                    query = `
                        SELECT SUM(quantity) as totalProduction 
                        FROM productions 
                        WHERE YEAR(productionDate) = YEAR(CURRENT_DATE())
                    `;
                    break;
                default:
                    reject('Invalid timeframe');
                    return;
            }
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching sum production for all solar panels:', err);
                    reject(err);
                } else {
                    resolve(results[0].totalProduction || 0); // Return 0 if no production found
                }
            });
        });
    }
}

module.exports = ProductionDAO;
