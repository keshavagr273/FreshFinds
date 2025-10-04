const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const signupValidation = [
  body('username').trim().isLength({ min: 2, max: 50 }).withMessage('Username must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number required')
];

const loginValidation = [
  body('userID').trim().notEmpty().withMessage('User ID is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/customer-signup', signupValidation, validate, authController.customerSignup);
router.post('/merchant-signup', signupValidation, validate, authController.merchantSignup);
router.post('/customer-login', loginValidation, validate, authController.customerLogin);
router.post('/merchant-login', loginValidation, validate, authController.merchantLogin);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;