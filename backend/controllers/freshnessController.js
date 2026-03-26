const FreshnessAnalysis = require('../models/FreshnessAnalysis');
const Product = require('../models/Product');

let gradioClientInstance = null;
let gradioHandleFile = null;

const modelConfig = {
  spaceId: process.env.FRESHNESS_SPACE_ID || 'keshav273/freshfinds-dl',
  apiName: process.env.FRESHNESS_PREDICT_API_NAME || '/predict_gradio',
  hfToken: process.env.HUGGINGFACE_TOKEN || ''
};

const getGradioClient = async () => {
  if (gradioClientInstance) {
    return gradioClientInstance;
  }

  const { Client, handle_file } = await import('@gradio/client');
  const options = modelConfig.hfToken ? { hf_token: modelConfig.hfToken } : undefined;
  gradioClientInstance = await Client.connect(modelConfig.spaceId, options);
  gradioHandleFile = handle_file;
  return gradioClientInstance;
};

const clampScore = (value) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(numericValue)));
};

const labelToScore = (label) => {
  const normalized = String(label || '').toLowerCase().replace(/[^a-z]/g, '');
  if (normalized.includes('veryfresh')) return 95;
  if (normalized.includes('fresh')) return 85;
  if (normalized.includes('good')) return 70;
  if (normalized.includes('moderate')) return 55;
  if (normalized.includes('fair')) return 50;
  if (normalized.includes('stale')) return 30;
  if (normalized.includes('poor')) return 25;
  if (normalized.includes('spoiled') || normalized.includes('rotten')) return 10;
  return 60;
};

const toLabelProbabilityPairs = (raw) => {
  if (!raw) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (Array.isArray(entry) && entry.length >= 2) {
          return [String(entry[0]), Number(entry[1])];
        }
        return null;
      })
      .filter((entry) => entry && Number.isFinite(entry[1]));
  }

  if (typeof raw === 'object') {
    if (Array.isArray(raw.confidences)) {
      return raw.confidences
        .map((entry) => [String(entry.label), Number(entry.confidence)])
        .filter((entry) => Number.isFinite(entry[1]));
    }

    return Object.entries(raw)
      .map(([label, probability]) => [String(label), Number(probability)])
      .filter((entry) => Number.isFinite(entry[1]));
  }

  return [];
};

const getStatusFromScore = (freshnessScore) => {
  if (freshnessScore >= 90) return 'very_fresh';
  if (freshnessScore >= 75) return 'fresh';
  if (freshnessScore >= 60) return 'good';
  if (freshnessScore >= 40) return 'fair';
  if (freshnessScore >= 25) return 'poor';
  return 'spoiled';
};

const getRecommendationsFromStatus = (status) => {
  if (status === 'very_fresh') {
    return [
      'Excellent quality! Perfect for immediate consumption.',
      'Store in optimal conditions to preserve freshness.',
      'Expected shelf life: around 5-7 days under refrigeration.'
    ];
  }

  if (status === 'fresh') {
    return [
      'Good quality produce with high freshness.',
      'Consume within 3-5 days for best taste and nutrition.',
      'Keep refrigerated to maintain quality longer.'
    ];
  }

  if (status === 'good') {
    return [
      'Acceptable quality and suitable for regular use.',
      'Consume within 2-3 days.',
      'Monitor texture and smell before using raw.'
    ];
  }

  if (status === 'fair') {
    return [
      'Quality is declining; prioritize use soon.',
      'Best used in cooked meals within 1-2 days.',
      'Inspect for discoloration or soft spots before use.'
    ];
  }

  if (status === 'poor') {
    return [
      'Low freshness detected; use immediately if still safe.',
      'Prefer cooking rather than raw consumption.',
      'Discard if any mold, foul odor, or slime is present.'
    ];
  }

  return [
    'Product likely spoiled; avoid consumption.',
    'Discard safely to prevent food-borne illness risk.',
    'Check nearby produce for cross-contamination.'
  ];
};

const estimateShelfLifeFromScore = (freshnessScore) => {
  if (freshnessScore >= 90) return { days: 6, hours: 0 };
  if (freshnessScore >= 75) return { days: 4, hours: 0 };
  if (freshnessScore >= 60) return { days: 3, hours: 0 };
  if (freshnessScore >= 40) return { days: 2, hours: 0 };
  if (freshnessScore >= 25) return { days: 1, hours: 0 };
  return { days: 0, hours: 12 };
};

const parseFreshnessScore = (resultText, probabilityPairs) => {
  const text = String(resultText || '');

  // Prefer structured class probabilities over free-form text.
  if (probabilityPairs.length > 0) {
    let weightedTotal = 0;
    let totalProbability = 0;

    probabilityPairs.forEach(([label, probability]) => {
      weightedTotal += labelToScore(label) * probability;
      totalProbability += probability;
    });

    if (totalProbability > 0) {
      return clampScore(weightedTotal / totalProbability) || 60;
    }

    return labelToScore(probabilityPairs[0][0]);
  }

  // Fallback: parse text label + percentage, e.g. "Prediction: Rotten (100.00%)".
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%/);
  const normalizedText = text.toLowerCase();
  if (percentMatch && percentMatch[1] !== undefined) {
    const parsedPercent = Number(percentMatch[1]);
    if (Number.isFinite(parsedPercent)) {
      if (normalizedText.includes('rotten') || normalizedText.includes('spoiled')) {
        return clampScore(100 - parsedPercent) || 0;
      }
      if (normalizedText.includes('fresh')) {
        return clampScore(parsedPercent) || 60;
      }
      return clampScore(parsedPercent) || 60;
    }
  }

  const numberMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    const parsedNumber = clampScore(numberMatch[1]);
    if (parsedNumber !== null) {
      return parsedNumber;
    }
  }

  return 60;
};

const parseConfidence = (probabilityPairs) => {
  if (probabilityPairs.length === 0) {
    return 80;
  }

  const topProbability = Math.max(...probabilityPairs.map((entry) => entry[1]));
  const percentage = topProbability <= 1 ? topProbability * 100 : topProbability;
  return clampScore(percentage) || 80;
};

const runFreshnessAnalysis = async (imagePath) => {
  const client = await getGradioClient();
  if (!gradioHandleFile) {
    throw new Error('Gradio file handler is not initialized');
  }

  const prediction = await client.predict(modelConfig.apiName, {
    image: await gradioHandleFile(imagePath)
  });

  const rawData = prediction && prediction.data;
  const data = Array.isArray(rawData) ? rawData : [];
  const resultText = data[0] || 'Freshness analyzed';
  const classProbabilities = data[1] || {};
  const probabilityPairs = toLabelProbabilityPairs(classProbabilities);

  const freshnessScore = parseFreshnessScore(resultText, probabilityPairs);
  const confidence = parseConfidence(probabilityPairs);
  const status = getStatusFromScore(freshnessScore);
  const parsedAnalysis = {
    freshnessScore,
    confidence,
    status,
    defects: [],
    estimatedShelfLife: estimateShelfLifeFromScore(freshnessScore),
    recommendations: getRecommendationsFromStatus(status)
  };

  return parsedAnalysis;
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

    const analysisStartTime = Date.now();
    const parsedAnalysis = await runFreshnessAnalysis(req.file.path);

    // Create analysis record
    const analysis = new FreshnessAnalysis({
      imageUrl: req.file.path || req.file.filename,
      analysisResults: parsedAnalysis,
      analyzedBy: 'ai_model',
      metadata: {
        modelVersion: modelConfig.spaceId,
        processingTime: Date.now() - analysisStartTime,
        imageSize: req.file.size,
        imageFormat: req.file.mimetype
      }
    });

    await analysis.save();

    res.json({
      success: true,
      message: 'Image analyzed successfully using deployed model',
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

    const analysisStartTime = Date.now();
    const parsedAnalysis = await runFreshnessAnalysis(req.file.path);

    // Create analysis record
    const analysis = new FreshnessAnalysis({
      product: productId,
      imageUrl: req.file.path || req.file.filename,
      analysisResults: parsedAnalysis,
      analyzedBy: 'ai_model',
      analyst: req.user._id,
      metadata: {
        modelVersion: modelConfig.spaceId,
        processingTime: Date.now() - analysisStartTime,
        imageSize: req.file.size,
        imageFormat: req.file.mimetype
      }
    });

    await analysis.save();

    // Update product freshness
    await product.updateFreshness(
      parsedAnalysis.freshnessScore,
      new Date(Date.now() + parsedAnalysis.estimatedShelfLife.days * 24 * 60 * 60 * 1000)
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