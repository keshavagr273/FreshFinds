const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  orderSummary: {
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  shippingAddress: {
    fullName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'cash_on_delivery', 'digital_wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  // Order tracking
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Customer feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  reviewedAt: Date,
  // Internal notes
  notes: String,
  // Delivery info
  deliverySlot: {
    date: Date,
    timeSlot: String
  },
  deliveryInstructions: String
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ customer: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    this.orderNumber = 'ORD' + Date.now().toString() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

// Instance method to update status
orderSchema.methods.updateStatus = function(status, note, updatedBy) {
  this.status = status;
  this.statusHistory.push({
    status,
    note,
    updatedBy
  });
  
  // Update specific timestamps
  if (status === 'delivered') {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Instance method to calculate total from items
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal + this.orderSummary.deliveryFee + this.orderSummary.tax - this.orderSummary.discount;
  
  this.orderSummary.subtotal = subtotal;
  this.orderSummary.total = total;
  
  return this;
};

// Static methods
orderSchema.statics.findByCustomer = function(customerId, options = {}) {
  return this.find({ customer: customerId })
    .populate('items.product', 'name images')
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 10);
};

orderSchema.statics.findByMerchant = function(merchantId, options = {}) {
  return this.find({ 'items.merchant': merchantId })
    .populate('customer', 'username email phone')
    .populate('items.product', 'name images')
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 10);
};

module.exports = mongoose.model('Order', orderSchema);