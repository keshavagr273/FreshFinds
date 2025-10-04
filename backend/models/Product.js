const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'dairy', 'bakery', 'protein', 'pantry', 'beverages', 'snacks', 'frozen', 'organic']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  merchant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Freshness and quality info
  freshness: {
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    analyzedAt: Date,
    expiryDate: Date,
    storageInstructions: String
  },
  // Inventory
  stock: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'piece', 'dozen', 'liter', 'ml'],
      default: 'piece'
    },
    minStock: {
      type: Number,
      default: 5
    }
  },
  // Nutrition information
  nutrition: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    sugar: String,
    sodium: String
  },
  ingredients: [String],
  allergens: [String],
  // Product metrics
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  views: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  },
  // Status and availability
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  organic: {
    type: Boolean,
    default: false
  },
  locallySourced: {
    type: Boolean,
    default: false
  },
  // SEO and search
  tags: [String],
  searchKeywords: [String],
  // Shipping info
  weight: Number, // in kg
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ merchant: 1 });
productSchema.index({ status: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for calculating discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount > 0) {
    return this.price * (1 - this.discount / 100);
  }
  return this.price;
});

// Virtual for checking if in stock
productSchema.virtual('inStock').get(function() {
  return this.stock.quantity > 0 && this.status === 'active';
});

// Pre-save middleware to update originalPrice
productSchema.pre('save', function(next) {
  if (this.isNew && !this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Instance method to update freshness score
productSchema.methods.updateFreshness = function(score, expiryDate) {
  this.freshness = {
    score,
    analyzedAt: new Date(),
    expiryDate,
    storageInstructions: this.freshness.storageInstructions
  };
  return this.save();
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'set') {
  switch (operation) {
    case 'add':
      this.stock.quantity += quantity;
      break;
    case 'subtract':
      this.stock.quantity = Math.max(0, this.stock.quantity - quantity);
      break;
    default:
      this.stock.quantity = quantity;
  }
  
  if (this.stock.quantity === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock') {
    this.status = 'active';
  }
  
  return this.save();
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, status: 'active' };
  return this.find(query)
    .populate('merchant', 'username storeName')
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20);
};

// Static method for search
productSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $and: [
      { status: 'active' },
      {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      }
    ]
  };
  
  return this.find(query)
    .populate('merchant', 'username storeName')
    .sort(options.sort || { 'rating.average': -1 })
    .limit(options.limit || 20);
};

module.exports = mongoose.model('Product', productSchema);