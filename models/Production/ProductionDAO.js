const db = require('../../config/connection');
const Production = require('../Production/Production');

class ProductionDAO {
    static async createProduction(production) {
        return new Promise((resolve, reject) => {
            const { productionDate, quantity, solarPanelId, battrieId } = production;
            db.query(
                'INSERT INTO productions (productionDate, quantity, solarPanel_id, battrie_id) VALUES (?, ?, ?, ?)',
                [productionDate, quantity, solarPanelId, battrieId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results.insertId);
                    }
                }
            );
        });
    }
    static async getAllProductions() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productions';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching all productions:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getProductionById(id) {
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

    static async updateProduction(production) {
        return new Promise((resolve, reject) => {
            const { id, productionDate, quantity, solarPanelId, battrieId } = production;
            db.query(
                'UPDATE productions SET productionDate = ?, quantity = ?, solarPanel_id = ?, battrie_id = ? WHERE id = ?',
                [productionDate, quantity, solarPanelId, battrieId, id],
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

    static async deleteProduction(id) {
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
    static async getProductionsByBattrieId(battrieId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM productions WHERE battrie_id = ?';
            db.query(query, [battrieId], (err, results) => {
                if (err) {
                    console.error('Error fetching productions by battrie ID:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async getProductionsBySolarId(solarId) {
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

    // Add more methods as needed
    static async reportProductionByDayForSolarPanelsWithRange(startDate = null, endDate = null) {
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
                    resolve(results);
                }
            });
        });
    }
    
   static async reportProductionByDayForBattriesWithRange(startDate = null, endDate = null) {
        let query = `
            SELECT productionDate, SUM(quantity) as totalQuantity 
            FROM productions 
            WHERE battrie_id IS NOT NULL -- Only consider productions related to batteries
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
                    console.error('Error generating production report for batteries with range:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getSumProductionForAllBattries(timeframe) {
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
                    console.error('Error fetching sum production for all battries:', err);
                    reject(err);
                } else {
                    resolve(results[0].totalProduction || 0); // Return 0 if no production found
                }
            });
        });
    }
    async getSumProductionForAllSolarPanels(timeframe) {
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
