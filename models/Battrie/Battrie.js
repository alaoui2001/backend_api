const EnergyDevice = require('../EnergyDevice/EnergyDevice');

class Battrie extends EnergyDevice {
    constructor(id, model, capacity, voltage, etat, networkSeller, networkBuyer) {
        super(id, model, capacity, voltage, etat);
        this.networkSeller = networkSeller; // Represents the network from which the battery is sold
        this.networkBuyer = networkBuyer; // Represents the network from which the battery is bought
    }
}

module.exports = Battrie;
