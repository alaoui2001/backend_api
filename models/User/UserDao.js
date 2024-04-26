const db = require('../../config/connection');
const User = require('./User');

class UserDAO {
    static async getUserById(id) {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length > 0) {
                        const userData = results[0];
                        const user = new User(userData.id, userData.firstname, userData.lastname, userData.email, userData.password);
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    static async getAllUsers() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM users', (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const users = results.map(userData => new User(userData.id, userData.firstname, userData.lastname, userData.email, userData.password));
                    resolve(users);
                }
            });
        });
    }

    static async createUser(user) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [user.firstname, user.lastname, user.email, user.password], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }

    static async updateUser(user) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET firstname = ?, lastname = ?, email = ?, password = ? WHERE id = ?', [user.firstname, user.lastname, user.email, user.password, user.id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }
    static async login(email, password) {
        return new Promise((resolve, reject) => {
          db.query(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password],
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                if (results.length > 0) {
                  resolve(results[0]); // Return the first user (assuming email is unique)
                } else {
                  resolve(null); // User not found or invalid credentials
                }
              }
            }
          );
        });
      }
      
  static async registerUser(user) {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
        [user.firstname, user.lastname, user.email, user.password],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.insertId); // Return the ID of the newly inserted user
          }
        }
      );
    });
  }
    static async deleteUser(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.affectedRows > 0);
                }
            });
        });
    }
}

module.exports = UserDAO;