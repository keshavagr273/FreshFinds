const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getJwtSecret = () => process.env.JWT_SECRET || 'iloveu';

// Basic authentication middleware
exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'Access token is required. Please log in.'
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'User account not found. Please log in again.'
      });
    }

    if (decoded.tokenVersion !== undefined && user.tokenVersion !== undefined && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        isExpired: true,
        message: 'Session expired. Please log in again.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'Account is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name, error.message);
    const isExpired = error.name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      isAuthError: true,
      isExpired,
      message: isExpired ? 'Session expired. Please log in again.' : 'Invalid token. Please log in again.'
    });
  }
};

// Optional authentication middleware (populates req.user if token is valid, doesn't reject if missing or expired)
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  } catch (error) {
    // If token is invalid or expired, continue as guest rather than blocking request
    req.user = null;
    next();
  }
};

// Merchant-only middleware
exports.merchantAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'Authentication required'
      });
    }
    if (req.user.role !== 'merchant') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Merchant role required.'
      });
    }
    next();
  } catch (error) {
    console.error('Merchant auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin-only middleware
exports.adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        isAuthError: true,
        message: 'Authentication required'
      });
    }
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};