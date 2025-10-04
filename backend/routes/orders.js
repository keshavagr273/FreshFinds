const express = require('express');
const orderController = require('../controllers/orderController');
const { auth, merchantAuth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Customer routes
router.get('/my-orders', orderController.getCustomerOrders);
router.post('/create', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.post('/:id/cancel', orderController.cancelOrder);
router.post('/:id/rate', orderController.rateOrder);

// Merchant routes
router.get('/merchant/orders', merchantAuth, orderController.getMerchantOrders);
router.put('/:id/status', merchantAuth, orderController.updateOrderStatus);
router.post('/:id/tracking', merchantAuth, orderController.updateTracking);

module.exports = router;