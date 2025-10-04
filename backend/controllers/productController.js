const Product = require('../models/Product');
const FreshnessAnalysis = require('../models/FreshnessAnalysis');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const products = await Product.find({ status: 'active' })
      .populate('merchant', 'username storeName')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    
    let query = { status: 'active' };
    
    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOption = sort || '-createdAt';

    const products = await Product.find(query)
      .populate('merchant', 'username storeName')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const products = await Product.findByCategory(category, {
      sort: req.query.sort,
      limit: limit
    }).skip(skip);

    const total = await Product.countDocuments({ category, status: 'active' });

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.find({ 
      status: 'active', 
      featured: true 
    })
    .populate('merchant', 'username storeName')
    .sort('-rating.average')
    .limit(limit);

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('merchant', 'username storeName email phone address');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create product (Merchant only)
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      merchant: req.user._id
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: req.body.name
      }));
    }

    const product = new Product(productData);
    await product.save();

    await product.populate('merchant', 'username storeName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    Object.assign(product, req.body);
    await product.save();

    await product.populate('merchant', 'username storeName');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Increment product views
exports.incrementViews = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }
    );

    res.json({
      success: true,
      message: 'View recorded'
    });

  } catch (error) {
    console.error('Increment views error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Rate product
exports.rateProduct = async (req, res) => {
  try {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Simple rating update (in production, you'd want to track individual ratings)
    const newCount = product.rating.count + 1;
    const newAverage = ((product.rating.average * product.rating.count) + rating) / newCount;

    product.rating = {
      average: Math.round(newAverage * 10) / 10,
      count: newCount
    };

    await product.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: { rating: product.rating }
    });

  } catch (error) {
    console.error('Rate product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add product images
exports.addProductImages = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: file.path,
        publicId: file.filename,
        alt: product.name
      }));

      product.images.push(...newImages);
      await product.save();
    }

    res.json({
      success: true,
      message: 'Images added successfully',
      data: product
    });

  } catch (error) {
    console.error('Add product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Remove product image
exports.removeProductImage = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    product.images = product.images.filter(
      img => img._id.toString() !== req.params.imageId
    );

    await product.save();

    res.json({
      success: true,
      message: 'Image removed successfully',
      data: product
    });

  } catch (error) {
    console.error('Remove product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update stock
exports.updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body;
    
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    await product.updateStock(quantity, operation);

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: { stock: product.stock, status: product.status }
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update freshness
exports.updateFreshness = async (req, res) => {
  try {
    const { score, expiryDate } = req.body;
    
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    await product.updateFreshness(score, expiryDate);

    res.json({
      success: true,
      message: 'Freshness updated successfully',
      data: { freshness: product.freshness }
    });

  } catch (error) {
    console.error('Update freshness error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};