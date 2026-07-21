const express = require('express');
const productController = require('../controllers/productController');
const { auth, merchantAuth } = require('../middleware/auth');
const { upload } = require('../controllers/uploadController');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', validateObjectId('id'), productController.getProductById);

// Protected routes - Customer
router.post('/:id/view', auth, validateObjectId('id'), productController.incrementViews);
router.post('/:id/rate', auth, validateObjectId('id'), productController.rateProduct);

// Protected routes - Merchant only
router.use(auth);
router.post('/', merchantAuth, upload.array('images', 5), productController.createProduct);
router.put('/:id', merchantAuth, validateObjectId('id'), productController.updateProduct);
router.delete('/:id', merchantAuth, validateObjectId('id'), productController.deleteProduct);
router.post('/:id/images', merchantAuth, validateObjectId('id'), upload.array('images', 5), productController.addProductImages);
router.delete('/:id/images/:imageId', merchantAuth, validateObjectId('id'), productController.removeProductImage);
router.put('/:id/stock', merchantAuth, validateObjectId('id'), productController.updateStock);
router.put('/:id/freshness', merchantAuth, validateObjectId('id'), productController.updateFreshness);

module.exports = router;