const express = require('express');
const router = express.Router();
const NetworkPublicDAO = require('../models/NetworkPublic/NetworkPublicDAO');
const NetworkPublic = require('../models/NetworkPublic/NetworkPublic');

// Create a new public network
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const newNetwork = new NetworkPublic(null, name);
        const newNetworkId = await NetworkPublicDAO.createNetwork(newNetwork);
        res.status(201).json({ id: newNetworkId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific public network by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const network = await NetworkPublicDAO.getNetworkById(id);
        if (network) {
            res.status(200).json(network);
        } else {
            res.status(404).json({ message: 'Public network not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update an existing public network
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updatedNetwork = new NetworkPublic(id, name);
        const success = await NetworkPublicDAO.updateNetwork(updatedNetwork);
        if (success) {
            res.status(200).json({ message: 'Public network updated successfully' });
        } else {
            res.status(404).json({ message: 'Public network not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a public network
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const success = await NetworkPublicDAO.deleteNetwork(id);
        if (success) {
            res.status(200).json({ message: 'Public network deleted successfully' });
        } else {
            res.status(404).json({ message: 'Public network not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
