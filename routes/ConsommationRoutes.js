const express = require('express');
const router = express.Router();
const ConsommationDAO = require('../models/Consommation/ConsommationDAO');

// Create a consommation
router.post('/', async (req, res) => {
    try {
        const newConsommationId = await ConsommationDAO.createConsommation(req.body);
        res.status(201).json({ id: newConsommationId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to get all consommations
router.get('/', async (req, res) => {
    try {
        const consommations = await ConsommationDAO.getAllConsommations();
        if (consommations.length > 0) {
            res.status(200).json(consommations);
        } else {
            res.status(404).json({ message: 'No consommations found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Route to generate consommation report for solar panels by day
router.get('/report/solarpanels', async (req, res) => {
    try {
        const report = await ConsommationDAO.reportConsommationByDayForSolarPanels();
        if (report.length > 0) {
            res.status(200).json(report);
        } else {
            res.status(404).json({ message: 'No consommation report available for solar panels' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Route to generate consommation report for batteries by day
router.get('/report/batteries', async (req, res) => {
    try {
        const report = await ConsommationDAO.reportConsommationByDayForBatteries();
        if (report.length > 0) {
            res.status(200).json(report);
        } else {
            res.status(404).json({ message: 'No consommation report available for batteries' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a consommation by ID
router.get('/:id', async (req, res) => {
    try {
        const consommation = await ConsommationDAO.getConsommationById(req.params.id);
        if (consommation) {
            res.status(200).json(consommation);
        } else {
            res.status(404).json({ error: 'Consommation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a consommation
router.put('/:id', async (req, res) => {
    try {
        req.body.id = req.params.id;
        const updated = await ConsommationDAO.updateConsommation(req.body);
        if (updated) {
            res.status(200).json({ message: 'Consommation updated successfully' });
        } else {
            res.status(404).json({ error: 'Consommation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a consommation
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await ConsommationDAO.deleteConsommation(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Consommation deleted successfully' });
        } else {
            res.status(404).json({ error: 'Consommation not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get sum consumption for battries by timeframe
router.get('/report/battries/:timeframe', async (req, res) => {
    const { timeframe } = req.params;
    try {
        const sumConsumptionForBattries = await ConsommationDAO.getSumConsumptionForBattries(timeframe);
        res.status(200).json({ sumConsumptionForBattries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get sum consumption for solar panels by timeframe
router.get('/report/solarpanels/:timeframe', async (req, res) => {
    const { timeframe } = req.params;
    try {
        const sumConsumptionForSolarPanels = await ConsommationDAO.getSumConsumptionForSolarPanels(timeframe);
        res.status(200).json({ sumConsumptionForSolarPanels });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
