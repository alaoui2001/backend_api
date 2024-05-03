const db=require('../../config/connection');
const Consommation = require('../Consommation/Consommation');

class ConsommationDAO {
    static async createConsommation(consommation) {
        return new Promise(async (resolve, reject) => {
            const { consommationDate, quantity, battrie_id, solarPanel_id } = consommation;

            let insertId = 0;

            db.beginTransaction(async (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                try {
                    const query = 'INSERT INTO consommations (consommationDate, quantity, battrie_id, solarPanel_id) VALUES (?, ?, ?, ?)';
                    db.query(query, [consommationDate, quantity, battrie_id, solarPanel_id], async (err, results) => {
                        if (err) {
                            db.rollback(() => {
                                reject(err);
                            });
                            return;
                        }

                        insertId = results.insertId;

                        if (solarPanel_id) {
                            const ProductionDAO = require('../Production/ProductionDAO');
                            const BattrieDAO = require('../Battrie/BattrieDAO');
                            const production = await ProductionDAO.getProductionByDateAndSolarId(consommationDate, solarPanel_id);
                            if (production) {
                                const newCapacity = production.quantity - quantity;
                                const battrie = await BattrieDAO.getBattrieBySolarPanelId(solarPanel_id);
                                const updatedBattrie = await BattrieDAO.updateBatteryCapacity(battrie.id, newCapacity);
                                if (!updatedBattrie) {
                                    db.rollback(() => {
                                        reject('Failed to update battery capacity');
                                    });
                                    return;
                                }
                            }
                        }

                        db.commit((err) => {
                            if (err) {
                                db.rollback(() => {
                                    reject(err);
                                });
                                return;
                            }
                            resolve(insertId);
                        });
                    });
                } catch (err) {
                    db.rollback(() => {
                        reject(err);
                    });
                }
            });
        });
    }
    
  static  async reportConsommationByDayForBatteries() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT consommationDate, SUM(quantity) as totalQuantity 
                FROM consommations 
                WHERE battrie_id IS NOT NULL -- Only consider consommations related to batteries
                GROUP BY consommationDate
            `;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error generating consommation report for batteries:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
   static async getAllConsommations() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM consommations';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching all consommations:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async reportConsommationByDayForSolarPanels() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT consommationDate, SUM(quantity) as totalQuantity 
                FROM consommations 
                WHERE solarPanel_id IS NOT NULL -- Only consider consommations related to solar panels
                GROUP BY consommationDate
            `;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error generating consommation report for solar panels:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }



    static async getConsommationById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM consommations WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const consommationData = results[0];
                        const consommation = new Consommation(
                            consommationData.id,
                            consommationData.consommationDate,
                            consommationData.quantity,
                            consommationData.battrie_id,
                            consommationData.solarPanel_id
                        );
                        resolve(consommation);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateConsommation(consommation) {
        return new Promise((resolve, reject) => {
            const { id, consommationDate, quantity, battrieId, solarPanelId } = consommation;
            db.query(
                'UPDATE consommations SET consommationDate = ?, quantity = ?, battrie_id = ?, solarPanel_id = ? WHERE id = ?',
                [consommationDate, quantity, battrieId, solarPanelId, id],
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

    static async deleteConsommation(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM consommations WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    static async reportConsumptionAndProduction(solarPanelId, startDate, endDate) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT 
                    c.id,
                    c.consommationDate,
                    c.quantity,
                    s.id AS solarPanelId,
                    s.etat AS solarPanelEtat,
                    b.id AS battrieId,
                    b.model AS battrieModel
                FROM 
                    consommations c
                INNER JOIN 
                    solar_panels s ON c.solarPanel_id = s.id
                INNER JOIN 
                    battries b ON c.battrie_id = b.id
                WHERE 
                    c.consommationDate BETWEEN ? AND ?
                    AND c.solarPanel_id = ?
                ORDER BY 
                    c.consommationDate`,
                [startDate, endDate, solarPanelId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        const consommations = results.map((row) => {
                            return new Consommation(
                                row.id,
                                row.consommationDate,
                                row.quantity,
                                { id: row.battrieId, model: row.battrieModel },
                                { id: row.solarPanelId, etat: row.solarPanelEtat }
                            );
                        });
                        resolve(consommations);
                    }
                }
            );
        });
    }

   static async getSumConsumptionForBattries(timeframe) {
        return new Promise((resolve, reject) => {
            let query;
            switch (timeframe) {
                case 'day':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE consommationDate = CURDATE()
                            AND battrie_id IS NOT NULL
                    `;
                    break;
                case 'month':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE MONTH(consommationDate) = MONTH(CURRENT_DATE()) 
                            AND YEAR(consommationDate) = YEAR(CURRENT_DATE())
                            AND battrie_id IS NOT NULL
                    `;
                    break;
                case 'year':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE YEAR(consommationDate) = YEAR(CURRENT_DATE())
                            AND battrie_id IS NOT NULL
                    `;
                    break;
                default:
                    reject('Invalid timeframe');
                    return;
            }
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching sum consumption for battries:', err);
                    reject(err);
                } else {
                    resolve(results[0].totalConsumption || 0); // Return 0 if no consumption found
                }
            });
        });
    }
    static async getConsommationByDateAndSolarId(consommationDate, solarPanelId) {
        return new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM consommations WHERE consommationDate = ? AND solarPanel_id = ?',
                [consommationDate, solarPanelId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length > 0) {
                            const consommationData = results[0];
                            
                            const consommation = new Consommation(
                                consommationData.id,
                                consommationData.consommationDate,
                                consommationData.quantity,
                                consommationData.battrie_id,
                                consommationData.solarPanel_id
                            );
                            resolve(consommation);
                        } else {
                            resolve(null);
                        }
                    }
                }
            );
        });
    }
    static async getSumConsumptionForSolarPanels(timeframe) {
        return new Promise((resolve, reject) => {
            let query;
            switch (timeframe) {
                case 'day':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE consommationDate = CURDATE()
                            AND solarPanel_id IS NOT NULL
                    `;
                    break;
                case 'month':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE MONTH(consommationDate) = MONTH(CURRENT_DATE()) 
                            AND YEAR(consommationDate) = YEAR(CURRENT_DATE())
                            AND solarPanel_id IS NOT NULL
                    `;
                    break;
                case 'year':
                    query = `
                        SELECT SUM(quantity) as totalConsumption 
                        FROM consommations 
                        WHERE YEAR(consommationDate) = YEAR(CURRENT_DATE())
                            AND solarPanel_id IS NOT NULL
                    `;
                    break;
                default:
                    reject('Invalid timeframe');
                    return;
            }
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching sum consumption for solar panels:', err);
                    reject(err);
                } else {
                    resolve(results[0].totalConsumption || 0); // Return 0 if no consumption found
                }
            });
        });
    }
}

module.exports = ConsommationDAO;
