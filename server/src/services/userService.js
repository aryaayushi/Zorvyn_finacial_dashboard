// server/src/services/userService.js
const { users } = require('./data');
const bcrypt = require('bcryptjs');

const userService = {
  getAll: () => users.map(({ password, ...u }) => u),
  getById: (id) => users.find(u => u.id === parseInt(id)),
  getByEmail: (email) => users.find(u => u.email === email),
  create: async (userData) => {
    const newUser = {
      id: users.length + 1,
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
      status: 'Active',
      role: userData.role || 'Viewer'
    };
    users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },
  update: (id, updateData) => {
    const index = users.findIndex(u => u.id === parseInt(id));
    if (index === -1) return null;
    users[index] = { ...users[index], ...updateData };
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }
};

module.exports = userService;
