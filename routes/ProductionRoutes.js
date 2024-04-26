const express = require('express');
const router = express.Router();
const ProductionDAO = require('../models/Production/ProductionDAO');

// Create a production
router.post('/', async (req, res) => {
    try {
        const newProductionId = await ProductionDAO.createProduction(req.body);
        res.status(201).json({ id: newProductionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a production by ID
router.get('/:id', async (req, res) => {
    try {
        const production = await ProductionDAO.getProductionById(req.params.id);
        if (production) {
            res.status(200).json(production);
        } else {
            res.status(404).json({ error: 'Production not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a production
router.put('/:id', async (req, res) => {
    try {
        req.body.id = req.params.id;
        const updated = await ProductionDAO.updateProduction(req.body);
        if (updated) {
            res.status(200).json({ message: 'Production updated successfully' });
        } else {
            res.status(404).json({ error: 'Production not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a production
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await ProductionDAO.deleteProduction(req.params.id);
        if (deleted) {
            res.status(200).json({ message: 'Production deleted successfully' });
        } else {
            res.status(404).json({ error: 'Production not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to get all productions
router.get('/', async (req, res) => {
    try {
        const productions = await ProductionDAO.getAllProductions();
        if (productions.length > 0) {
            res.status(200).json(productions);
        } else {
            res.status(404).json({ message: 'No productions found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Report production for a specific date
router.get('/report/solar_panels', async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const report = await ProductionDAO.reportProductionByDayForSolarPanelsWithRange( startDate, endDate);
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Route to generate production report for batteries by day with optional date range
router.get('/report/batteries', async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const report = await ProductionDAO.reportProductionByDayForBattriesWithRange(startDate, endDate);
        if (report.length > 0) {
            res.status(200).json(report);
        } else {
            res.status(404).json({ message: 'No production report available for batteries within the specified date range' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/report/battries/:timeframe', async (req, res) => {
    const { timeframe } = req.params;
    try {
        const sumProductionForAllBattries = await ProductionDAO.getSumProductionForAllBattries(timeframe);
        res.status(200).json({ sumProductionForAllBattries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/report/solarpanels/:timeframe', async (req, res) => {
    const { timeframe } = req.params;
    try {
        const sumProductionForAllSolarPanels = await ProductionDAO.getSumProductionForAllSolarPanels(timeframe);
        res.status(200).json({ sumProductionForAllSolarPanels });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
