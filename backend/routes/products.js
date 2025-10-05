const express = require('express');
const productController = require('../controllers/productController');
const { auth, merchantAuth } = require('../middleware/auth');
const { upload } = require('../controllers/uploadController');

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProductById);

// Protected routes - Customer
router.post('/:id/view', auth, productController.incrementViews);
router.post('/:id/rate', auth, productController.rateProduct);

// Protected routes - Merchant only
router.use(auth);
router.post('/', merchantAuth, upload.array('images', 5), productController.createProduct);
router.put('/:id', merchantAuth, productController.updateProduct);
router.delete('/:id', merchantAuth, productController.deleteProduct);
router.post('/:id/images', merchantAuth, upload.array('images', 5), productController.addProductImages);
router.delete('/:id/images/:imageId', merchantAuth, productController.removeProductImage);
router.put('/:id/stock', merchantAuth, productController.updateStock);
router.put('/:id/freshness', merchantAuth, productController.updateFreshness);

module.exports = router;