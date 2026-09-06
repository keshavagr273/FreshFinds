const express = require('express');
const freshnessController = require('../controllers/freshnessController');
const { auth, optionalAuth, merchantAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public & Optional Auth routes
router.get('/status', freshnessController.getFreshnessServiceStatus);
router.get('/history/:productId', freshnessController.getProductFreshnessHistory);
router.post('/analyze', optionalAuth, upload.single('image'), freshnessController.analyzeImage);

// Protected routes (Requires valid user authentication)
router.get('/analysis/:id', auth, freshnessController.getAnalysis);

// Merchant routes
router.post('/product/:productId/analyze', auth, merchantAuth, upload.single('image'), freshnessController.analyzeProductImage);
router.get('/merchant/analyses', auth, merchantAuth, freshnessController.getMerchantAnalyses);

module.exports = router;