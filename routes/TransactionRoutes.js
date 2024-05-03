// transactionRouter.js

const express = require('express');
const router = express.Router();
const TransactionDAO = require('../models/Transaction/TransactionDAO'); // Import your TransactionDAO

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await TransactionDAO.getAllTransactions();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// GET transaction by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const transaction = await TransactionDAO.getTransactionById(id);
        if (transaction) {
            res.json(transaction);
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

// POST create new transaction
router.post('/', async (req, res) => {
    const { price, transactionDate, networkId, type } = req.body;
    const transactionData = { price, transactionDate, networkId, type };
    try {
        const newTransactionId = await TransactionDAO.createTransaction(transactionData);
        res.status(201).json({ id: newTransactionId, message: 'Transaction created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

// PUT update transaction by ID
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { price, transactionDate, networkId, type } = req.body;
    const updatedTransactionData = { id, price, transactionDate, networkId, type };
    try {
        const success = await TransactionDAO.updateTransaction(updatedTransactionData);
        if (success) {
            res.json({ message: 'Transaction updated successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update transaction' });
    }
});

// DELETE transaction by ID
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const success = await TransactionDAO.deleteTransaction(id);
        if (success) {
            res.json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete transaction' });
    }
});
// Route for reporting cost and benefit by day
router.get('/report/cost-benefit/:timeframe', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;; // Assuming start and end dates are provided in query params

        // Call the TransactionDAO method to get the report
        const report = await TransactionDAO.reportCostAndBenefitByDay(req.params.timeframe,startDate, endDate);

        // Send the report as a JSON response
        res.json(report);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error generating cost and benefit report:', error);
        res.status(500).json({ error: 'An error occurred while generating the report' });
    }
});

module.exports = router;
