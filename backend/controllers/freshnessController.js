const FreshnessAnalysis = require('../models/FreshnessAnalysis');
const Product = require('../models/Product');

// Simulate AI freshness analysis
const simulateAIAnalysis = (imageBuffer) => {
  // In a real application, this would call an actual AI service
  // For demo purposes, we'll generate random but realistic results
  
  const freshnessScore = Math.floor(Math.random() * 40) + 60; // 60-100
  
  let status, recommendations = [];
  
  if (freshnessScore >= 90) {
    status = 'very_fresh';
    recommendations = [
      'Excellent quality! Perfect for immediate consumption.',
      'Store in optimal conditions to maintain freshness.',
      'Expected shelf life: 5-7 days under proper storage.'
    ];
  } else if (freshnessScore >= 80) {
    status = 'fresh';
    recommendations = [
      'Good quality with minor imperfections.',
      'Consume within 3-5 days for best quality.',
      'Store in refrigerator to extend freshness.'
    ];
  } else if (freshnessScore >= 70) {
    status = 'good';
    recommendations = [
      'Fair quality - suitable for immediate use.',
      'Consume within 2-3 days.',
      'Check regularly for any changes in condition.'
    ];
  } else {
    status = 'fair';
    recommendations = [
      'Consider using soon or for cooking.',
      'Consume within 1-2 days.',
      'Suitable for processed foods rather than raw consumption.'
    ];
  }

  const defects = [];
  if (freshnessScore < 85) {
    const possibleDefects = ['bruising', 'discoloration', 'soft_spots', 'brown_spots'];
    const numDefects = Math.floor(Math.random() * 2) + 1;
    
    for (let i = 0; i < numDefects; i++) {
      const defect = possibleDefects[Math.floor(Math.random() * possibleDefects.length)];
      defects.push({
        type: defect,
        severity: freshnessScore > 75 ? 'low' : 'medium',
        location: 'Surface area'
      });
    }
  }

  return {
    freshnessScore,
    confidence: Math.floor(Math.random() * 15) + 85, // 85-100
    status,
    defects,
    estimatedShelfLife: {
      days: Math.floor(freshnessScore / 20) + 1,
      hours: Math.floor(Math.random() * 24)
    },
    recommendations
  };
};

// Analyze uploaded image
exports.analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Simulate AI analysis
    const analysisResults = simulateAIAnalysis(req.file.buffer);

    // Create analysis record
    const analysis = new FreshnessAnalysis({
      imageUrl: req.file.path || req.file.filename,
      analysisResults,
      analyzedBy: 'ai_model',
      metadata: {
        modelVersion: '1.0.0',
        processingTime: Math.floor(Math.random() * 2000) + 500, // 500-2500ms
        imageSize: req.file.size,
        imageFormat: req.file.mimetype
      }
    });

    await analysis.save();

    res.json({
      success: true,
      message: 'Image analyzed successfully',
      data: analysis
    });

  } catch (error) {
    console.error('Analyze image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during analysis'
    });
  }
};

// Analyze product image (Merchant only)
exports.analyzeProductImage = async (req, res) => {
  try {
    const { productId } = req.params;

    // Verify product belongs to merchant
    const product = await Product.findOne({
      _id: productId,
      merchant: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Simulate AI analysis
    const analysisResults = simulateAIAnalysis(req.file.buffer);

    // Create analysis record
    const analysis = new FreshnessAnalysis({
      product: productId,
      imageUrl: req.file.path || req.file.filename,
      analysisResults,
      analyzedBy: 'ai_model',
      analyst: req.user._id,
      metadata: {
        modelVersion: '1.0.0',
        processingTime: Math.floor(Math.random() * 2000) + 500,
        imageSize: req.file.size,
        imageFormat: req.file.mimetype
      }
    });

    await analysis.save();

    // Update product freshness
    await product.updateFreshness(
      analysisResults.freshnessScore,
      new Date(Date.now() + analysisResults.estimatedShelfLife.days * 24 * 60 * 60 * 1000)
    );

    res.json({
      success: true,
      message: 'Product image analyzed successfully',
      data: {
        analysis,
        updatedProduct: {
          freshness: product.freshness
        }
      }
    });

  } catch (error) {
    console.error('Analyze product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during analysis'
    });
  }
};

// Get analysis by ID
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await FreshnessAnalysis.findById(req.params.id)
      .populate('product', 'name images')
      .populate('analyst', 'username');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get product freshness history
exports.getProductFreshnessHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await FreshnessAnalysis.find({ product: productId })
      .populate('analyst', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FreshnessAnalysis.countDocuments({ product: productId });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAnalyses: total
      }
    });

  } catch (error) {
    console.error('Get product freshness history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get merchant analyses
exports.getMerchantAnalyses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get products belonging to the merchant
    const merchantProducts = await Product.find({ merchant: req.user._id }, '_id');
    const productIds = merchantProducts.map(p => p._id);

    const analyses = await FreshnessAnalysis.find({ 
      product: { $in: productIds } 
    })
    .populate('product', 'name images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await FreshnessAnalysis.countDocuments({ 
      product: { $in: productIds } 
    });

    res.json({
      success: true,
      data: analyses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalAnalyses: total
      }
    });

  } catch (error) {
    console.error('Get merchant analyses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};