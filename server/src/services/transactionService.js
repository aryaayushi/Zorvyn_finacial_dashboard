// server/src/services/transactionService.js
const { transactions } = require('./data');

const transactionService = {
  getAll: (filters = {}) => {
    let result = [...transactions];
    if (filters.category) result = result.filter(t => t.category === filters.category);
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.startDate) result = result.filter(t => new Date(t.date) >= new Date(filters.startDate));
    if (filters.endDate) result = result.filter(t => new Date(t.date) <= new Date(filters.endDate));
    return result;
  },
  getById: (id) => transactions.find(t => t.id === parseInt(id)),
  create: (txData) => {
    const newTx = {
      id: transactions.length + 1,
      ...txData,
      date: txData.date || new Date().toISOString()
    };
    transactions.push(newTx);
    return newTx;
  },
  update: (id, updateData) => {
    const index = transactions.findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;
    transactions[index] = { ...transactions[index], ...updateData };
    return transactions[index];
  },
  delete: (id) => {
    const index = transactions.findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;
    transactions.splice(index, 1);
    return true;
  },
  getSummary: () => {
    const totalIncome = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryTotals,
      recentActivity: transactions.slice(-5).reverse()
    };
  }
};

module.exports = transactionService;
