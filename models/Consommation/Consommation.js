class Consommation {
    constructor(id, consommationDate, quantity, battrie, solarPanel) {
        this.id = id;
        this.consommationDate = consommationDate;
        this.quantity = quantity;
        this.battrie = battrie;
        this.solarPanel = solarPanel;
    }
}

module.exports = Consommation;