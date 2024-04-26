const express = require('express');
const router = express.Router();
const SolarPanelDAO = require('../models/SolarPanel/SolarPanelDAO');

// Get a specific solar panel by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solarPanel = await SolarPanelDAO.getSolarPanelById(id);
        if (solarPanel) {
            res.status(200).json(solarPanel);
        } else {
            res.status(404).json({ message: 'Solar panel not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/',async  (req, res) => {
    try {
    const solarPanels=await SolarPanelDAO.getAllSolarPanels();
    if (solarPanels) {
        res.status(200).json(solarPanels);
    } else {
        res.status(404).json({ message: 'Solar panel not found' });
    }
} catch (err) {
    res.status(500).json({ error: err.message });
}
});

// Create a new solar panel
router.post('/', async (req, res) => {
    try {
        const solarPanelData = req.body;
        const newSolarPanelId = await SolarPanelDAO.createSolarPanel(solarPanelData);
        res.status(201).json({ id: newSolarPanelId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing solar panel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const solarPanelData = req.body;
        solarPanelData.id = id;
        const success = await SolarPanelDAO.updateSolarPanel(solarPanelData);
        if (success) {
            res.status(200).json({ message: 'Solar panel updated successfully' });
        } else {
            res.status(404).json({ message: 'Solar panel not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a solar panel
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await SolarPanelDAO.deleteSolarPanel(id);
        if (success) {
            res.status(200).json({ message: 'Solar panel deleted successfully' });
        } else {
            res.status(404).json({ message: 'Solar panel not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
