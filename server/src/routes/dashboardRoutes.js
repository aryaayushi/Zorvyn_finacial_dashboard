// server/src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/role');

router.use(authenticateToken);

// Restricted to Admin and Analyst
router.get('/summary', authorize(['Admin', 'Analyst']), dashboardController.getSummary);

module.exports = router;
