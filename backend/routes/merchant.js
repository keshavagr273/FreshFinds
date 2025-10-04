const express = require('express');
const merchantController = require('../controllers/merchantController');
const { auth, merchantAuth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and merchant role
router.use(auth, merchantAuth);

router.get('/dashboard', merchantController.getDashboard);
router.get('/products', merchantController.getMyProducts);
router.get('/orders', merchantController.getMyOrders);
router.get('/customers', merchantController.getMyCustomers);
router.get('/analytics', merchantController.getAnalytics);
router.get('/inventory/low-stock', merchantController.getLowStockProducts);
router.put('/store/settings', merchantController.updateStoreSettings);

module.exports = router;