from sklearn.tree import DecisionTreeClassifier
import numpy as np
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
    if action == 0:
        return "Charge de batterie"
    elif action == 1:
        return "Décharge de batterie"
    elif action == 2:
        return "Achat d'énergie"
    elif action == 3:
        return "Vente d'énergie"
    else:
        return "Action inconnue"

# Exemple d'utilisation
print("entrer le besion")
besoin = input()
print("entrer la production")
production = input()
print("entrer l'etat de battrie")
etatBatterie = input()
action = gestionEnergieSolaireML(besoin, production, etatBatterie)
print("Votre besion:", besoin)
print("Votre production:", production)
print("Votre etatBatterie:", etatBatterie)
print("Action prédite:", action)