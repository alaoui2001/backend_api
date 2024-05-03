class SolarPanel {
    constructor(id, etat, marque, model, capacity, efficiency, width, height, installationDate, battrie) {
        this.id = id;
        this.etat = etat;
        this.marque = marque;
        this.model = model;
        this.capacity = capacity;
        this.efficiency = efficiency;
        this.width = width;
        this.height = height;
        this.installationDate = installationDate;
        this.battrie = battrie; // Assuming battrie is an object with properties like id, model, capacityMax, etc.
    }
}

module.exports = SolarPanel;