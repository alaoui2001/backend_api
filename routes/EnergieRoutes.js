const express = require('express');
const router = express.Router();
const EnergyDAO = require('../models/Energie/EnergieDao');

// Route to report cost and benefit by timeframe
router.get('/report-cost-benefit/:timeframe', async (req, res) => {
    const { startDate, endDate } = req.query;
    const {timeframe}=req.params
    

    try {
        const report = await EnergyDAO.reportCostAndBenefitByTimeframe(timeframe, startDate, endDate);
        res.json(report);
    } catch (error) {
        console.error('Error generating cost and benefit report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Energy
router.post('/', async (req, res) => {
    try {
      const energy = req.body; // Assuming the request body contains the energy data
      const newEnergyId = await EnergyDAO.createEnergy(energy);
      res.status(201).json({ id: newEnergyId });
    } catch (error) {
      console.error('Error creating energy:', error);
      res.status(500).json({ error: 'Failed to create energy' });
    }
  });
  
  // Get Energy by ID
  router.get('/:id', async (req, res) => {
    const energyId = req.params.id;
    try {
      const energy = await EnergyDAO.getEnergyById(energyId);
      if (!energy) {
        return res.status(404).json({ error: 'Energy not found' });
      }
      res.json(energy);
    } catch (error) {
      console.error('Error getting energy by ID:', error);
      res.status(500).json({ error: 'Failed to get energy' });
    }
  });
  
  // Update Energy by ID
  router.put('/:id', async (req, res) => {
    const energyId = req.params.id;
    const updatedEnergy = req.body; // Assuming the request body contains the updated energy data
    try {
      const success = await EnergyDAO.updateEnergy(energyId, updatedEnergy);
      if (!success) {
        return res.status(404).json({ error: 'Energy not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error updating energy by ID:', error);
      res.status(500).json({ error: 'Failed to update energy' });
    }
  });
  
  // Delete Energy by ID
  router.delete('/:id', async (req, res) => {
    const energyId = req.params.id;
    try {
      const success = await EnergyDAO.deleteEnergy(energyId);
      if (!success) {
        return res.status(404).json({ error: 'Energy not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting energy by ID:', error);
      res.status(500).json({ error: 'Failed to delete energy' });
    }
  });
  
  // Get All Energies
  router.get('/', async (req, res) => {
    try {
      const energies = await EnergyDAO.getAllEnergies();
      res.json(energies);
    } catch (error) {
      console.error('Error getting all energies:', error);
      res.status(500).json({ error: 'Failed to get energies' });
    }
  });
  

module.exports = router;
