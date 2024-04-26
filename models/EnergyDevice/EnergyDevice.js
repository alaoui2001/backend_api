class EnergyDevice {
    constructor(id, model, capacity, voltage, etat) {
        this.id = id;
        this.model = model;
        this.capacity = capacity; // in ampere-hours (Ah) or watt-hours (Wh)
        this.voltage = voltage; // nominal voltage
        this.etat = etat; // status or condition
       
    }
}

module.exports = EnergyDevice;