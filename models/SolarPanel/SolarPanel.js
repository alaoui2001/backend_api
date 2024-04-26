const EnergyDevice = require('../EnergyDevice/EnergyDevice');

class SolarPanel extends EnergyDevice {
    constructor(id, model, capacity, voltage, etat, name, manufacturer, efficiency, width, height, installationDate) {
        super(id, model, capacity, voltage, etat);
        this.name = name;
        this.manufacturer = manufacturer;
        this.efficiency = efficiency; // as a percentage
        this.width = width; // in meters or inches
        this.height = height; // in meters or inches
        this.installationDate = installationDate; // Date object
    }
}

module.exports = SolarPanel;