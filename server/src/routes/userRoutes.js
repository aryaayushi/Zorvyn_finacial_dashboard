// server/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/role');

router.use(authenticateToken);
router.use(authorize('Admin'));

// Admin only routes for managing users
router.get('/', (req, res) => {
  res.json(userService.getAll());
});

router.get('/:id', (req, res) => {
  const user = userService.getById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

router.put('/:id', (req, res) => {
  const { role, status } = req.body;
  const updatedUser = userService.update(req.params.id, { role, status });
  if (!updatedUser) return res.status(404).json({ error: 'User not found.' });
  res.json(updatedUser);
});

module.exports = router;
