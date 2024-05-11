const db = require('../../config/connection');
const BattrieDAO = require('../Battrie/BattrieDAO');

class EnergieDAO {
    static async createEnergy(energy) {
        return new Promise( (resolve, reject) => {
            const { quantity, battrie_id, solarPanel_id, transactionDate, type } = energy;
            let price=1
            db.query(
                'INSERT INTO energies (quantity, battrie_id, solarPanel_id, price, transactionDate, type) VALUES (?, ?, ?, ?, ?, ?)',
                [quantity, battrie_id, solarPanel_id, price, transactionDate, type],
                async (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        await BattrieDAO.updateBatteryCapacity(battrie_id,quantity*price)
                        resolve(results.insertId);
                    }
                }
            );
        });
    }

    static async getEnergyById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM energies WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const energyData = results[0];
                        const energy = {
                            id: energyData.id,
                            quantity: energyData.quantity,
                            battrie_id: energyData.battrie_id,
                            solarPanel_id: energyData.solarPanel_id,
                            price: energyData.price,
                            transactionDate: energyData.transactionDate,
                            type: energyData.type
                        };
                        resolve(energy);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateEnergy(energy) {
        return new Promise((resolve, reject) => {
            const { id, quantity, battrie_id, solarPanel_id, transactionDate, type } = energy;
            let price=1
            db.query(
                'UPDATE energies SET quantity = ?, battrie_id = ?, solarPanel_id = ?, price = ?, transactionDate = ?, type = ? WHERE id = ?',
                [quantity, battrie_id, solarPanel_id, price, transactionDate, type, id],
                async (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        await BattrieDAO.updateBatteryCapacity(battrie_id,quantity*price)
                        resolve(results.affectedRows > 0);
                    }
                }
            );
        });
    }

    static async deleteEnergy(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM energies WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    } 
    static async reportCostAndBenefitByTimeframe(timeframe, startDate = null, endDate = null) {
        let groupByClause = '';
        let dateFormat = '';
        const params = [];

        switch (timeframe) {
            case 'day':
                groupByClause = 'GROUP BY DATE(transactionDate)';
                dateFormat = '%Y-%m-%d';
                break;
            case 'month':
                groupByClause = 'GROUP BY YEAR(transactionDate), MONTH(transactionDate)';
                dateFormat = '%Y-%m';
                break;
            case 'year':
                groupByClause = 'GROUP BY YEAR(transactionDate)';
                dateFormat = '%Y';
                break;
            default:
                throw new Error('Invalid timeframe specified.');
        }

        let query = `
            SELECT 
                DATE_FORMAT(transactionDate, ?) as date,
                SUM(CASE WHEN type = 'buying' THEN price*quantity ELSE 0 END) AS totalCost,
                SUM(CASE WHEN type = 'selling' THEN price*quantity ELSE 0 END) AS totalBenefit
            FROM
                energies
        `;

        params.push(dateFormat);

        if (startDate && endDate) {
            query += ' WHERE transactionDate BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ` ${groupByClause}`;

        return new Promise((resolve, reject) => {
            db.query(query, params, (err, results) => {
                if (err) {
                    console.error('Error generating cost and benefit report:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    } 
}

module.exports = EnergieDAO;
