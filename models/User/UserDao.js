const db = require('../../config/connection');
const User = require('./User');
const { SimpleLinearRegression } = require('ml-regression-simple-linear');
const ProductionDAO = require('../Production/ProductionDAO');
const ConsommationDAO = require('../Consommation/ConsommationDAO');

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
      static async takeDecision(consommation){
        const ProductionDAO=require("../Production/ProductionDAO")
        const BattrieDAO=require("../Battrie/BattrieDAO")
           let message=""
          let production=await ProductionDAO.getAverageProductionByDay(2024);
          
               production =production[0].averageProduction
               console.log(production)
               if(production >= consommation){
                message += `Ce jour, on va combler notre besion par la consommation de ${consommation} kWh à partir des panneaux solaires  `;
                let Surplus=production-consommation
                let battrieDispo= await BattrieDAO.getSumCapacityDifference();
                battrieDispo=battrieDispo[0].totalDifference
                
                console.log(battrieDispo)
                if(Surplus==0){

                }
                else if(battrieDispo >=Surplus){
                    message+="puis on va remplir des batteries par "+ parseInt(Surplus)+"kwh à partir  de ces panneaux ";
                }
                else{
                    message+="puis on va remplir des batteries "+parseInt(battrieDispo)+" à partir  de ces panneaux  puis onn va vendre "+(Surplus-battrieDispo)+" kWh au reseau public"
                }
              }
              else{
                message += `Ce jour, on va consommer ${parseInt(production)} kWh à partir de ces panneaux  `;
                console.log(production)
                let energieNecessaire=consommation-production
                let battriecapacity= await BattrieDAO.getSumCapacity()
                battriecapacity=battriecapacity[0].sumCapacity
                console.log(battriecapacity)
                console.log(energieNecessaire)
                if(battriecapacity>=energieNecessaire){
                    message+="puis On va consommer "+parseInt(Math.abs(energieNecessaire))+" kWh a partir des battries  energieNecessaire"
                }
                else {
                    message+="puis on va consommer "+( parseInt(Math.abs(battriecapacity)))+" kWh a partir des battries  energieNecessaire "
                    message+="puis on va acheter  l'energie depuis le reseau public: "+parseInt(Math.abs(energieNecessaire- battriecapacity))+"kWh"
                
                {
    
                }
              }
          }
          return message
    }
    static async extractDataForDecision(){
      const ProductionDAO=require("../Production/ProductionDAO")
      const BattrieDAO=require("../Battrie/BattrieDAO")
         let message=""
        let production=await ProductionDAO.reportProductionByDayForSolarPanelsWithRange(null,null );
        
        let consommation=await ConsommationDAO.reportConsommationByDayForSolarPanels( );
          
        
        let capacitybatterie=await BattrieDAO.getSumCapacity();
        let battrieDispo= await BattrieDAO.getSumCapacityDifference();
        capacitybatterie=capacitybatterie[0]["sumCapacity"]
        let data=[]
        let Surplus=0
        for(let i=production.length-1;i>=0;i--){
        
          let datatobject={consommation:consommation[i].totalQuantity,
            production  :production[i].totalQuantity,
            capacity:null,
            action: null
          }
          
            Surplus= datatobject["production"]-  datatobject["consommation"]
           
           
            console.log(capacitybatterie)
            capacitybatterie+=Surplus
            datatobject["capacity"]=  capacitybatterie
            if(datatobject["production"]> datatobject["consommation"]  ){
              if(battrieDispo >=Surplus){
                datatobject["action"]=0
              }
              else{
                datatobject["action"]=3
              }
             
            }
            else {
              let energieNecessaire=-Surplus
              if(capacitybatterie>=energieNecessaire){
                datatobject["action"]=1
              }
              else{
                datatobject["action"]=2
              }
            }
            data[i]=datatobject
        }
        return data
  }
    
        static async predictDecision(consommation) {
          // Fetch data for training the model
          const productionData = await ProductionDAO.getAllProductions();
          const consommationData = await ConsommationDAO.getAllConsommations();
          const BattrieDAO=require("../Battrie/BattrieDAO")
       // Get all unique dates from both production and consumption data
         const allDates = [
           ...new Set([
        ...productionData.map(p => p.productionDate.toISOString().split('T')[0]),
        ...consommationData.map(c => c.consommationDate.toISOString().split('T')[0])
            ])
        ];
          // Calculate the sum of consumption for each day for solar panels and batteries
          let X = {};
          let Y = {};
          consommationData.forEach(consommation => {
              const date = Date.parse(consommation.consommationDate).toString("yyyy-mm-dd");;
             
              X[date] = (X[date] || 0) + consommation.quantity;
          });
  
          // Prepare the data for training
          productionData.forEach(production => {
            const date = Date.parse(production.productionDate).toString("yyyy-mm-dd");
           
            Y[date] = (Y[date] || 0) + production.quantity;
        });
        

              X=allDates.map(date=> X[date] = (X[date] || 0) )
              Y= allDates.map(date=> Y[date] = (Y[date] || 0) )
              if(X.length <3){
                X[1]=(X[1]|| X[0]+1)
                X[2]=(X[2]||  X[1]+1 ||  X[0])
              Y[1]=(Y[1]|| Y[0])
              Y[2]=(Y[2]||Y[1] ||Y[0])
              }
           
           console.log(X)
         console.log(Y)
          // Train the Linear Regression model
          const regression = new SimpleLinearRegression( X,Array.from(Y));
          console.log(regression)
          // Predict surplus based on the given consumption
          let message =[]
         const production= regression.predict([consommation])[0];
         console.log("production "+production)
         if(production >= consommation){
          message += `Ce jour, on va combler notre besion par la consommation de ${consommation} kWh à partir des panneaux solaires  `;
          let Surplus=production-consommation
          let battrieDispo= await BattrieDAO.getSumCapacityDifference();
          battrieDispo=battrieDispo[0].totalDifference
          
          console.log(battrieDispo)
          if(battrieDispo >=Surplus){
              message+="puis on va remplir des batteries par "+ parseInt(Surplus)+"kwh à partir  de ces panneaux ";
          }
          else{
              message+="puis on va remplir des batteries "+parseInt(battrieDispo)+" à partir  de ces panneaux  puis onn va vendre "+(Surplus-battrieDispo)+" kWh au reseau public"
          }
        }
        else{
          message += `Ce jour, on va consommer ${parseInt(production)} kWh à partir de ces panneaux  `;
          console.log(production)
          let energieNecessaire=consommation-production
          let battriecapacity= await BattrieDAO.getSumCapacity()
          battriecapacity=battriecapacity[0].sumCapacity
          console.log(battriecapacity)
          console.log(energieNecessaire)
          if(battriecapacity>=energieNecessaire){
              message+="puis On va consommer "+parseInt(Math.abs(energieNecessaire))+" kWh a partir des battries  energieNecessaire"
          }
          else {
              message+="puis on va consommer "+( parseInt(Math.abs(battriecapacity)))+" kWh a partir des battries  energieNecessaire "
              message+="puis on va acheter  l'energie depuis le reseau public: "+parseInt(Math.abs(energieNecessaire- battriecapacity))+"kWh"
          
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