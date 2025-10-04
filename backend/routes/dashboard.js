const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Customer dashboard
router.get('/customer', auth, dashboardController.getCustomerDashboard);

// Admin routes (if needed)
router.get('/admin', auth, adminAuth, dashboardController.getAdminDashboard);

module.exports = router;