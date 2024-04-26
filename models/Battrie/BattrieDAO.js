const db = require('../../config/connection');
const Battrie = require('../Battrie/Battrie');

class BattrieDAO {
    static async createBattrie(battrie) {
        return new Promise((resolve, reject) => {
            const { model, capacity, voltage, etat, networkSeller, networkBuyer } = battrie;
            db.query(
                'INSERT INTO batteries (model, capacity, voltage, etat, network_seller, network_buyer) VALUES (?, ?, ?, ?, ?, ?)',
                [model, capacity, voltage, etat, networkSeller, networkBuyer],
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
    static   async getAllBattries() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM batteries';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching batteries:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getBattrieById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM batteries WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const battrieData = results[0];
                        const battrie = new Battrie(
                            battrieData.id,
                            battrieData.model,
                            battrieData.capacity,
                            battrieData.voltage,
                            battrieData.etat,
                            battrieData.network_seller,
                            battrieData.network_buyer
                        );
                        resolve(battrie);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateBattrie(battrie) {
        return new Promise((resolve, reject) => {
            const { id, model, capacity, voltage, etat, networkSeller, networkBuyer } = battrie;
            db.query(
                'UPDATE batteries SET model = ?, capacity = ?, voltage = ?, etat = ?, network_seller = ?, network_buyer = ? WHERE id = ?',
                [model, capacity, voltage, etat, networkSeller, networkBuyer, id],
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

    static async deleteBattrie(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM batteries WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }

    static async reportConsumptionAndProduction(battrieId, startDate, endDate) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT 
                    date, 
                    SUM(CASE WHEN type = 'production' THEN value ELSE 0 END) AS totalProduction, 
                    SUM(CASE WHEN type = 'consumption' THEN value ELSE 0 END) AS totalConsumption
                FROM
                    consommations
                WHERE
                    battrie_id = ? AND date BETWEEN ? AND ?
                
                ORDER BY
                    date`,
                [battrieId, startDate, endDate],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }
}

module.exports = BattrieDAO;
