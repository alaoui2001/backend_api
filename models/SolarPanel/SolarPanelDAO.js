const db = require('../../config/connection');
const SolarPanel = require('../SolarPanel/SolarPanel');
const BattrieDAO = require('../Battrie/BattrieDAO');

class SolarPanelDAO {
    static getSolarPanelById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM solar_panels WHERE id = ?';
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const solarPanelData = results[0];
                        BattrieDAO.getBattrieById(solarPanelData.battrie_id)
                            .then(battrie => {
                                const solarPanel = new SolarPanel(
                                    solarPanelData.id,
                                    solarPanelData.etat,
                                    solarPanelData.marque,
                                    solarPanelData.model,
                                    solarPanelData.capacity,
                                    solarPanelData.efficiency,
                                    solarPanelData.width,
                                    solarPanelData.height,
                                    solarPanelData.installationDate,
                                    battrie
                                );
                                resolve(solarPanel);
                            })
                            .catch(err => reject(err));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static getAllSolarPanels() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM solar_panels';
            db.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const solarPanels = [];
                    const promises = results.map(panel => {
                        return new Promise((res, rej) => {
                            BattrieDAO.getBattrieById(panel.battrie_id)
                                .then(battrie => {
                                    const solarPanel = new SolarPanel(
                                        panel.id,
                                        panel.etat,
                                        panel.marque,
                                        panel.model,
                                        panel.capacity,
                                        panel.efficiency,
                                        panel.width,
                                        panel.height,
                                        panel.installationDate,
                                        battrie
                                    );
                                    solarPanels.push(solarPanel);
                                    res();
                                })
                                .catch(err => rej(err));
                        });
                    });
                    Promise.all(promises)
                        .then(() => resolve(solarPanels))
                        .catch(err => reject(err));
                }
            });
        });
    }

    static createSolarPanel(solarPanel) {
        return new Promise((resolve, reject) => {
            const { etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id } = solarPanel;
            const query = 'INSERT INTO solar_panels (etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            });
        });
    }

    static updateSolarPanel(solarPanel) {
        return new Promise((resolve, reject) => {
            const { id, etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id } = solarPanel;
            const query = 'UPDATE solar_panels SET etat = ?, marque = ?, model = ?, capacity = ?, efficiency = ?, width = ?, height = ?, installationDate = ?, battrie_id = ? WHERE id = ?';
            db.query(query, [etat, marque, model, capacity, efficiency, width, height, installationDate, battrie_id,id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    }

    static deleteSolarPanel(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM solar_panels WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    }

    static reportConsumptionAndProduction(solarPanelId, startDate, endDate) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    date, 
                    SUM(CASE WHEN type = 'production' THEN value ELSE 0 END) AS totalProduction, 
                    SUM(CASE WHEN type = 'consumption' THEN value ELSE 0 END) AS totalConsumption
                FROM
                    consommations
                WHERE
                    solarPanel_id = ? AND date BETWEEN ? AND ?
                ORDER BY
                    date
            `;
            db.query(query, [solarPanelId, startDate, endDate], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = SolarPanelDAO;
