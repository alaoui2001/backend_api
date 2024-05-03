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
      static async takeDecision(need){
        const ProductionDAO=require("../Production/ProductionDAO")
        const BattrieDAO=require("../Battrie/BattrieDAO")
           let message=""
          let production=await ProductionDAO.getAverageProductionByMonth(2024);
          
               production =production[0].averageProduction
               console.log(production)
          if(production >= need){
            message += `Ce mois on va consommer ${need} kWh a partir des panneaux solaires \n `;
            let Surplus=production-need
            let battrieDispo= await BattrieDAO.getSumCapacityDifference();
            battrieDispo=battrieDispo[0].totalDifference
            console.log(battrieDispo)
            if(battrieDispo >=Surplus){
                message+="Ce mois on va remplir des batteries par "+Surplus+"kwh a partir des panneaux solaires";
            }
            else{
                message+="Ce mois on va remplir des batteries a partir des panneaux solaires \n On va vendre "+(Surplus-battrieDispo)+" kWh au reseau public"
            }
          }
          else{
            message += `Ce mois on va consommer ${production} kWh a partir des panneaux solaires \n `; 
            let energieNecessaire=need-production
            let battriecapacity= await BattrieDAO.getSumCapacity()
            battriecapacity=battriecapacity[0].sumCapacity
            console.log(battriecapacity)
            if(battriecapacity>=energieNecessaire){
                message+="On va consommer "+energieNecessaire+" kWh a partir des battries  energieNecessaire"
            }
            else {
                message+="Ce mois on va consommer "+( battriecapacity)+" kWh a partir des battries  energieNecessaire \n"
                message+="Ce mois on va acheter  l'energie depuis le reseau public: "+(energieNecessaire- battriecapacity)+"kWh"
            
            {

            }
          }
      }
      return message
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