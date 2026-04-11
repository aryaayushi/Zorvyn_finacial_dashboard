// server/src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/role');

router.use(authenticateToken);

router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);

// Restricted to Admin only
router.post('/', authorize('Admin'), transactionController.create);
router.put('/:id', authorize('Admin'), transactionController.update);
router.delete('/:id', authorize('Admin'), transactionController.delete);

module.exports = router;
