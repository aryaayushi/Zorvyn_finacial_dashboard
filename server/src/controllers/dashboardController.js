// server/src/controllers/dashboardController.js
const transactionService = require('../services/transactionService');

const dashboardController = {
  getSummary: (req, res) => {
    const summary = transactionService.getSummary();
    res.json(summary);
  }
};

module.exports = dashboardController;
