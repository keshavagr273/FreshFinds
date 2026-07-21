const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
  skipSuccessfulRequests: true,
});

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
router.post('/customer-login', authLimiter, loginValidation, validate, authController.customerLogin);
router.post('/merchant-login', authLimiter, loginValidation, validate, authController.merchantLogin);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router;