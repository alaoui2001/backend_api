const express = require('express');
const router = express.Router();
const BattrieDAO = require('../models/Battrie/BattrieDAO');
const NetworkPublic = require('../models/NetworkPublic/NetworkPublic');

// Create a new battery
router.post('/', async (req, res) => {
    try {
        const { model, capacity, voltage, etat, network } = req.body;
        const networkObject = network ? new NetworkPublic(network.id, network.name) : null;
        const newBattrie = new Battrie(null, model, capacity, voltage, etat, networkObject);
        const newBattrieId = await BattrieDAO.createBattrie(newBattrie);
        res.status(201).json({ id: newBattrieId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Route to get all batteries
router.get('/', async (req, res) => {
    try {
        const batteries = await BattrieDAO.getAllBattries();
        if (batteries.length > 0) {
            res.status(200).json(batteries);
        } else {
            res.status(404).json({ message: 'No batteries found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific battery by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const battrie = await BattrieDAO.getBattrieById(id);
        if (battrie) {
            res.status(200).json(battrie);
        } else {
            res.status(404).json({ message: 'Battery not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing battery
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { model, capacity, voltage, etat, network } = req.body;
        const networkObject = network ? new NetworkPublic(network.id, network.name) : null;
        const updatedBattrie = new Battrie(id, model, capacity, voltage, etat, networkObject);
        const success = await BattrieDAO.updateBattrie(updatedBattrie);
        if (success) {
            res.status(200).json({ message: 'Battery updated successfully' });
        } else {
            res.status(404).json({ message: 'Battery not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a battery
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await BattrieDAO.deleteBattrie(id);
        if (success) {
            res.status(200).json({ message: 'Battery deleted successfully' });
        } else {
            res.status(404).json({ message: 'Battery not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;
