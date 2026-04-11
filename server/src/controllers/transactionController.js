// server/src/controllers/transactionController.js
const transactionService = require('../services/transactionService');

const transactionController = {
  getAll: (req, res) => {
    const { category, type, startDate, endDate } = req.query;
    const transactions = transactionService.getAll({ category, type, startDate, endDate });
    res.json(transactions);
  },

  getById: (req, res) => {
    const tx = transactionService.getById(req.params.id);
    if (!tx) return res.status(404).json({ error: 'Transaction not found.' });
    res.json(tx);
  },

  create: (req, res) => {
    const { amount, type, category, notes, date } = req.body;
    if (!amount || !type || !category) {
      return res.status(400).json({ error: 'Amount, type, and category are required.' });
    }
    const newTx = transactionService.create({ 
      amount: parseFloat(amount), 
      type, 
      category, 
      notes, 
      date,
      userId: req.user.id 
    });
    res.status(201).json(newTx);
  },

  update: (req, res) => {
    const updatedTx = transactionService.update(req.params.id, req.body);
    if (!updatedTx) return res.status(404).json({ error: 'Transaction not found.' });
    res.json(updatedTx);
  },

  delete: (req, res) => {
    const success = transactionService.delete(req.params.id);
    if (!success) return res.status(404).json({ error: 'Transaction not found.' });
    res.status(204).send();
  }
};

module.exports = transactionController;
