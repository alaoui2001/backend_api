const  db=require('../../config/connection');
const NetworkPublic = require('../NetworkPublic/NetworkPublic');

class NetworkPublicDAO {
    static async createNetwork(network) {
        return new Promise((resolve, reject) => {
            const { name } = network;
            db.query(
                'INSERT INTO network_public (name) VALUES (?)',
                [name],
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
 static async getAllNetworks() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM network_public', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    // Map the results to NetworkPublic objects
                    const networks = results.map(networkData => {
                        return new NetworkPublic(
                            networkData.id,
                            networkData.name
                        );
                    });
                    resolve(networks);
                }
            });
        });
    }
    static async getNetworkById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM network_public WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const networkData = results[0];
                        const network = new NetworkPublic(networkData.id, networkData.name);
                        resolve(network);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateNetwork(network) {
        return new Promise((resolve, reject) => {
            const { id, name } = network;
            db.query(
                'UPDATE network_public SET name = ? WHERE id = ?',
                [name, id],
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

    static async deleteNetwork(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM network_public WHERE id = ?', [id], (err, results) => {
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

module.exports = NetworkPublicDAO;
