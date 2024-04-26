const db = require('../../config/connection');
const SolarPanel = require('./SolarPanel');
const Production = require('../Production/Production');
const ProductionDAO = require('../Production/ProductionDAO');

class SolarPanelDAO {
    static async getSolarPanelById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM solar_panels WHERE id = ?', [id], async (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const solarPanelData = results[0];
                        const solarPanel = new SolarPanel(
                            solarPanelData.id,
                            solarPanelData.model,
                            solarPanelData.capacity,
                            solarPanelData.voltage,
                            solarPanelData.etat,
                            solarPanelData.owner,
                            solarPanelData.name,
                            solarPanelData.manufacturer,
                            solarPanelData.efficiency,
                            solarPanelData.width,
                            solarPanelData.height,
                            solarPanelData.installation_date
                        );
                        // Fetch associated productions
                        const productions = await ProductionDAO.getProductionsBySolarId(solarPanel.id);
                        solarPanel.productions = productions;
                        resolve(solarPanel);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

   static async getAllSolarPanels() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM solar_panels';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching solar panels:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static async createSolarPanel(solarPanel) {
        return new Promise((resolve, reject) => {
            const { model, capacity, voltage, etat, owner, name, manufacturer, efficiency, width, height, installationDate } = solarPanel;
            db.query(
                'INSERT INTO solar_panels (model, capacity, voltage, etat, owner, name, manufacturer, efficiency, width, height, installation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [model, capacity, voltage, etat, owner, name, manufacturer, efficiency, width, height, installationDate],
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

    static async updateSolarPanel(solarPanel) {
        return new Promise((resolve, reject) => {
            const { id, model, capacity, voltage, etat, owner, name, manufacturer, efficiency, width, height, installationDate } = solarPanel;
            db.query(
                'UPDATE solar_panels SET model = ?, capacity = ?, voltage = ?, etat = ?, owner = ?, name = ?, manufacturer = ?, efficiency = ?, width = ?, height = ?, installation_date = ? WHERE id = ?',
                [model, capacity, voltage, etat, owner, name, manufacturer, efficiency, width, height, installationDate, id],
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

    static async deleteSolarPanel(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM solar_panels WHERE id = ?', [id], (err, results) => {
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
                    date, 
                    SUM(CASE WHEN type = 'production' THEN value ELSE 0 END) AS totalProduction, 
                    SUM(CASE WHEN type = 'consumption' THEN value ELSE 0 END) AS totalConsumption
                FROM
                    consommations
                WHERE
                    solarPanel_id = ? AND date BETWEEN ? AND ?
                
                ORDER BY
                    date`,
                [solarPanelId, startDate, endDate],
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

module.exports = SolarPanelDAO;
