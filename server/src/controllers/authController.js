// server/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = userService.getByEmail(email);

    if (!user || user.status !== 'Active') {
      return res.status(401).json({ error: 'Invalid credentials or inactive account.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'zorvyn_secret_123',
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  },

  register: async (req, res) => {
    const { email, password, role } = req.body;
    if (userService.getByEmail(email)) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    try {
      const user = await userService.create({ email, password, role });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: 'Error creating user.' });
    }
  }
};

module.exports = authController;
