class Energie {
    constructor(id, quantity, battrie, solarPanel, transactionId) {
        this.id = id;
        this.quantity = quantity;
        this.battrie = battrie; // Object of type Battrie
        this.solarPanel = solarPanel; // Object of type SolarPanel
        this.transactionId = transactionId; // ID of the transaction
    }
}

module.exports = Energie;
