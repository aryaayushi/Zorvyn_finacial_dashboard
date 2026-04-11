// server/src/services/data.js
const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    email: 'admin@zorvyn.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    email: 'analyst@zorvyn.com',
    password: bcrypt.hashSync('analyst123', 10),
    role: 'Analyst',
    status: 'Active'
  },
  {
    id: 3,
    email: 'viewer@zorvyn.com',
    password: bcrypt.hashSync('viewer123', 10),
    role: 'Viewer',
    status: 'Active'
  }
];

const transactions = [
  { id: 1, amount: 16000, type: 'Expense', category: 'Rent', date: new Date().toISOString(), notes: 'Monthly rent', userId: 1 },
  { id: 2, amount: 5000, type: 'Income', category: 'Salary', date: new Date().toISOString(), notes: 'Part-time gig', userId: 1 },
];

module.exports = { users, transactions };
