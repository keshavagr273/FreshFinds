const express = require('express');
const freshnessController = require('../controllers/freshnessController');
const { auth, merchantAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/history/:productId', freshnessController.getProductFreshnessHistory);

// Protected routes
router.use(auth);
router.post('/analyze', upload.single('image'), freshnessController.analyzeImage);
router.get('/analysis/:id', freshnessController.getAnalysis);

// Merchant routes
router.post('/product/:productId/analyze', merchantAuth, upload.single('image'), freshnessController.analyzeProductImage);
router.get('/merchant/analyses', merchantAuth, freshnessController.getMerchantAnalyses);

module.exports = router;