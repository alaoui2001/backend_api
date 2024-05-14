from sklearn.tree import DecisionTreeClassifier
import matplotlib.pyplot as plt
import numpy as np
import random
import requests
URL = "http://localhost:3000/users/extract"
# Données d'entraînement simplifiées
r = requests.get(url = URL)
data=r.json()


X_train=[]
y_train=[]
for d in data:
    X_train.append([d["consommation"],d["production"],d["capacity"]])
    y_train.append(d["action"])
X_train= np.array(X_train)
y_train = np.array(y_train)  # 0: charge, 1: décharge, 2: achat, 3: vente

# Création et entraînement du modèle
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)

# Fonction de prédiction
def gestionEnergieSolaireML(besoin, production, etatBatterie):
    # Préparez les données d'entrée pour la prédiction
    X = np.array([[besoin, production, etatBatterie]])

    # Prédiction
    action = clf.predict(X)[0]

    # Retourne l'action prédite
    #if action == 0:
     #   return "Charge de batterie"
    #elif action == 1:
   #     return "Décharge de batterie"
    #elif action == 2:
     #   return "Achat d'énergie"
    #elif action == 3:
     #   return "Vente d'énergie"
    #else:
        #return "Action inconnue"
    return action    

# Exemple d'utilisation
action1=[]
x=[]
action=[]
cost_benifit=[]
charge_decharge=[]
cost_benifit2=[]
charge_decharge2=[]
for i in range(1,31):
    production=random.randint(100, 1000)
    need=random.randint(100, 1000)
    x.append(i)
    etatBatterie=random.randint(100, 1000)
    URL = "http://localhost:3000/users/takeDecisionClass?production="+str(production)+"&etatbattrie="+str(etatBatterie)+"&need="+str(need)
    # Données d'entraînement simplifiées
    r = requests.get(url = URL)
    data=r.json()
    
   
    
    if data["message"] == 0 :
        cost_benifit.append({"benifit":0, "cost":0})
        charge_decharge.append({"charge":production-need, "decharge":0})
    elif data["message"] == 1:
        cost_benifit.append({"benifit":0, "cost":0})
        charge_decharge.append({"charge":0, "decharge":production-need})
        action1.append("Décharge de batterie")
    elif data["message"] == 2:
        charge_decharge.append({"charge":0, "decharge":-etatBatterie})
        cost_benifit.append({"benifit": need-production -etatBatterie, "cost":0})
    elif data["message"] == 3:
        charge_decharge.append({"charge":data["disp"], "decharge":0})
        cost_benifit.append({"benifit":0, "cost":-(production-data["disp"]-need)})
  
    data2=gestionEnergieSolaireML(need, production, etatBatterie)
    
    if data2 == 0 :
        dict={"benifit":0, "cost":0}
        cost_benifit2.append(dict)
        charge_decharge2.append({"charge":production-need, "decharge":0})
    elif data2 == 1:
        cost_benifit2.append({"benifit":0, "cost":0})
        charge_decharge2.append({"charge":0, "decharge":production-need})
        
    elif data2 == 2:
        charge_decharge2.append({"charge":0, "decharge":-etatBatterie})
        cost_benifit2.append({"benifit": need-production -etatBatterie, "cost":0})
    elif data2 == 3:
        charge_decharge2.append({"charge":data["disp"], "decharge":0})
        cost_benifit2.append({"benifit":0, "cost":-(production-data["disp"]-need)})
    
   
x=np.array(x)
x1=np.array(x)
print(len(charge_decharge))
get_value = np.vectorize(lambda x, key: x[key])

charge_decharge=np.array(charge_decharge)
charge =get_value(charge_decharge,"charge") 
decharge =get_value(charge_decharge,"decharge") 
charge_decharge2=np.array(charge_decharge2)
charge2 =get_value(charge_decharge2,"charge") 
decharge2 =get_value(charge_decharge2,"decharge") 
cost_benifit=np.array(cost_benifit)
cost =get_value(cost_benifit,"cost") 
benifit =get_value(cost_benifit,"benifit") 
cost_benifit2=np.array(cost_benifit2)
cost2 =get_value(cost_benifit2,"cost") 
benifit2 =get_value(cost_benifit2,"benifit") 
plt.subplot(2, 2, 1)
plt.plot(x,charge,label = 'classic charge',color = 'g')
plt.plot(x,decharge,label = 'classic charge',color = 'r')

plt.title("charge et decharge classic fonction")
plt.xlabel("jour")
plt.ylabel("classe")
plt.subplot(2, 2, 2)
plt.plot(x,charge2,label = 'ia charge',color = 'g')
plt.plot(x,decharge2,label = 'ia decharge',color = 'r')
plt.title("charge et decharge ia fonction")
plt.xlabel("jour")
plt.ylabel("classe")

plt.subplot(2, 2, 3)
plt.plot(x,benifit,label = 'ia charge',color = 'g')
plt.plot(x,cost,label = 'ia decharge',color = 'r')
plt.title("cout et benifice ia fonction")
plt.xlabel("jour")
plt.ylabel("classe")
plt.subplot(2, 2, 4)
plt.plot(x,benifit2,label = 'ia charge',color = 'g')
plt.plot(x,cost2,label = 'ia decharge',color = 'r')
plt.title("charge et benifice ia fonction")
plt.xlabel("jour")
plt.ylabel("classe")
plt.tight_layout()
plt.show()