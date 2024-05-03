class Battrie {
    constructor(id, model, capacity, voltage, etat, capacityMax) {
       
        this.id = id;
        this.model = model;
        this.capacity = capacity;
        this.voltage = voltage;
        this.etat = etat;
        this.capacityMax = capacityMax; // Adding capacityMax property
    }
}

module.exports = Battrie;