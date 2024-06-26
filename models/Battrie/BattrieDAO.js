const db = require('../../config/connection');
const Battrie = require('../Battrie/Battrie');

class BattrieDAO {
    static async createBattrie(battrie) {
        return new Promise((resolve, reject) => {
            const { model, capacity, voltage, etat, capacityMax } = battrie;
            db.query(
                'INSERT INTO batteries (model, capacity, voltage, etat, capacityMax) VALUES (?, ?, ?, ?, ?)',
                [model, capacity, voltage, etat, capacityMax],
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
    static async getSumCapacityDifference() {
        return new Promise((resolve, reject) => {
            const query = `
               SELECT 
                       SUM(capacityMax - capacity) as totalDifference
                FROM batteries
                
            `;
            db.query(query, [], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getSumCapacityDisp() {
        return new Promise((resolve, reject) => {
            const query = `
                select   (( SELECT 
                       SUM(capacityMax) 
                FROM batteries) - capacity) as disp from capacities
                
            `;
            db.query(query, [], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getSumCapacity() {
        return new Promise((resolve, reject) => {
            const query = `
               SELECT 
                       SUM(capacity) as sumCapacity
                FROM batteries
               
            `;
            db.query(query, [], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    static async getSumCapacityMax() {
        return new Promise((resolve, reject) => {
            const query = `
               SELECT 
                       SUM(capacityMax) as sumCapacitymax
                FROM batteries
               
            `;
            db.query(query, [], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(results)
                    resolve(results)
                }
            });
        });
    }
    
    static getBattrieBySolarPanelId(solarPanelId) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM batteries WHERE id=(select battrie_id from solar_panels where id = ?)';
            db.query(query, [solarPanelId], (err, results) => {
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
                            battrieData.capacityMax
                            
                            
                        );
                        resolve(battrie);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
    static async getAllBattries() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM batteries';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching batteries:', err);
                    reject(err);
                } else {
                    // Add capacityMax to each battery object
                    const batteries = results.map(battery => {
                        return new Battrie(
                            battery.id,
                            battery.model,
                            battery.capacity,
                            battery.voltage,
                            battery.etat,
                            battery.capacityMax // Added capacity_max here
                        );
                    });
                    resolve(batteries);
                }
            });
        });
    }
    static async getBattriesCapacities() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT capacity FROM capacities ';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching batteries:', err);
                    reject(err);
                } else {
                    // Add capacityMax to each battery object
                  
                    resolve(results);
                }
            });
        });
    }
    static async getAvailableBattries() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM batteries where id not in (select battrie_id from solar_panels )';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching batteries:', err);
                    reject(err);
                } else {
                    // Add capacityMax to each battery object
                    const batteries = results.map(battery => {
                        return new Battrie(
                            battery.id,
                            battery.model,
                            battery.capacity,
                            battery.voltage,
                            battery.etat,
                            battery.capacityMax // Added capacity_max here
                        );
                    });
                    resolve(batteries);
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
                            battrieData.capacityMax // Added capacity_max here
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
            const { id, model, capacity, voltage, etat, capacityMax } = battrie;
            db.query(
                'UPDATE batteries SET model = ?, capacity = ?, voltage = ?, etat = ?, capacityMax = ? WHERE id = ?',
                [model, capacity, voltage, etat, capacityMax, id],
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
    static async updateBatteryCapacity(battrieId, capacityAdded,date) {
        
        return new Promise( async (resolve, reject) => {
            

          try{

        
            // Fetch the current capacity and capacityMax
            console.log(20)
            await db.query('SELECT capacity, capacityMax FROM batteries WHERE id = ?', [battrieId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const { capacity, capacityMax } = results[0];
                        const newCapacity = capacity + capacityAdded;
                        const updatedCapacity = newCapacity > capacityMax ? capacityMax : newCapacity;
                         
                        // Update the battery capacity
                        db.query(
                            'select * from capacities where capacitydate=?',
                            [date],
                           async  (err, results) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    console.log(10)
                                    if (results.length > 0) {
                                        console.log(results.length)
                                         db.query(
                                            'UPDATE capacities SET capacity =capacity + ? WHERE capacitydate = ?',
                                            [capacity, date],
                                            (err, updateResults) => {
                                                if (err) 
                                                    reject(err);
                                                
                                            }
                                        );
                                    }
                                    else{
                                        
                                               db.query(
                                                  'insert into capacities(capacity,capacitydate) VALUES (?, ?)',
                                                  [capacity, date],
                                                  (inserterr, insertResults) => {
                                                      if (inserterr) {
                                                          reject(inserterr);
                                                      }
                                                  }
                                              );
                                           
                                    }

                                    
                                }
                            }
                        );
                        db.query(
                            'UPDATE batteries SET capacity = ? WHERE id = ?',
                            [updatedCapacity, battrieId],
                            (updateErr, updateResults) => {
                                if (updateErr) {
                                    reject(updateErr);
                                } else {
                                    resolve(updateResults.affectedRows > 0);
                                }
                            }
                        );
                    } else {
                        reject('Battery not found');
                    }
                }
            });
        }catch(e){
            console.log(e)
        }
        }
        
        );
  
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
