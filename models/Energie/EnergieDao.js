const db = require('../../config/connection');
const Energie = require('Energie');

class EnergieDAO {
    static async createEnergie(energie) {
        return new Promise((resolve, reject) => {
            const { quantity, battrie, solarPanel, transaction } = energie;
            const battrieId = battrie ? battrie.id : null;
            const solarPanelId = solarPanel ? solarPanel.id : null;
            db.query(
                'INSERT INTO energies (quantity, battrie_id, solarPanel_id, transaction_id) VALUES (?, ?, ?, ?)',
                [quantity, battrieId, solarPanelId, transaction.id],
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

    static async getAllEnergies() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM energies';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching energies:', err);
                    reject(err);
                } else {
                    // Map database results to Energie objects
                    const energies = results.map(energy => {
                        return new Energie(
                            energy.id,
                            energy.quantity,
                            energy.battrie_id, // Assuming battrie_id is the ID of the battery object
                            energy.solarPanel_id, // Assuming solarPanel_id is the ID of the solar panel object
                            energy.transaction_id
                        );
                    });
                    resolve(energies);
                }
            });
        });
    }

    static async getEnergieById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM energies WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const energieData = results[0];
                        const energie = new Energie(
                            energieData.id,
                            energieData.quantity,
                            energieData.battrie_id, // Assuming battrie_id is the ID of the battery object
                            energieData.solarPanel_id, // Assuming solarPanel_id is the ID of the solar panel object
                            energieData.transaction_id
                        );
                        resolve(energie);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateEnergie(energie) {
        return new Promise((resolve, reject) => {
            const { id, quantity, battrie, solarPanel, transactionId } = energie;
            const battrieId = battrie ? battrie.id : null;
            const solarPanelId = solarPanel ? solarPanel.id : null;
            db.query(
                'UPDATE energies SET quantity = ?, battrie_id = ?, solarPanel_id = ?, transaction_id = ? WHERE id = ?',
                [quantity, battrieId, solarPanelId, transactionId, id],
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

    static async deleteEnergie(id) {
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

    // Add more methods as needed
}

module.exports = EnergieDAO;
