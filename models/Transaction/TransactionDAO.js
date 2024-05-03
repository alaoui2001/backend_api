const db = require('../../config/connection');
const Transaction = require('../Transaction/Transaction');

class TransactionDAO {
    static async createTransaction(transaction) {
        return new Promise((resolve, reject) => {
            const { price, transactionDate, network, type } = transaction;
            db.query(
                'INSERT INTO transactions (price, transactionDate, network_id, type) VALUES (?, ?, ?, ?)',
                [price, transactionDate, network.id, type],
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

    static async getAllTransactions() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM transactions';
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Error fetching all transactions:', err);
                    reject(err);
                } else {
                    // Map database results to Transaction objects
                    const transactions = results.map(transaction => {
                        return new Transaction(
                            transaction.id,
                            transaction.price,
                            transaction.transactionDate,
                            transaction.network_id,
                            transaction.type
                        );
                    });
                    resolve(transactions);
                }
            });
        });
    }

    static async getTransactionById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM transactions WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const transactionData = results[0];
                        const transaction = new Transaction(
                            transactionData.id,
                            transactionData.price,
                            transactionData.transactionDate,
                            transactionData.network_id,
                            transactionData.type
                        );
                        resolve(transaction);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async updateTransaction(transaction) {
        return new Promise((resolve, reject) => {
            const { id, price, transactionDate, network, type } = transaction;
            db.query(
                'UPDATE transactions SET price = ?, transactionDate = ?, network_id = ?, type = ? WHERE id = ?',
                [price, transactionDate, network.id, type, id],
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

    static async deleteTransaction(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM transactions WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }
    static async reportCostAndBenefitByDay(timeframe, startDate = null, endDate = null) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT 
                    DATE_FORMAT(transactionDate, '%Y-%m-%d') AS date,
                    SUM(CASE WHEN type = 'buying' THEN price ELSE 0 END) AS totalCost,
                    SUM(CASE WHEN type = 'selling' THEN price ELSE 0 END) AS totalBenefit
                FROM
                    transactions
            `;
    
            const params = [];
            let groupBy = '';
    
            switch (timeframe) {
                case 'day':
                    groupBy = 'GROUP BY DATE_FORMAT(transactionDate, "%Y-%m-%d")';
                    break;
                case 'month':
                    groupBy = 'GROUP BY DATE_FORMAT(transactionDate, "%Y-%m")';
                    break;
                case 'year':
                    groupBy = 'GROUP BY DATE_FORMAT(transactionDate, "%Y")';
                    break;
                default:
                    reject('Invalid timeframe');
                    return;
            }
    
            if (startDate && endDate) {
                query += ' WHERE transactionDate BETWEEN ? AND ?';
                params.push(startDate, endDate);
            }
    
            query += ` ${groupBy}`;
    
            db.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
    
    
}

module.exports = TransactionDAO;
