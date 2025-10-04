const mongoose = require('mongoose');

const freshnessAnalysisSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  analysisResults: {
    freshnessScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    status: {
      type: String,
      enum: ['very_fresh', 'fresh', 'good', 'fair', 'poor', 'spoiled'],
      required: true
    },
    defects: [{
      type: {
        type: String,
        enum: ['bruising', 'discoloration', 'soft_spots', 'mold', 'wrinkles', 'brown_spots', 'wilting']
      },
      severity: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      location: String
    }],
    estimatedShelfLife: {
      days: Number,
      hours: Number
    },
    recommendations: [String]
  },
  analyzedBy: {
    type: String,
    enum: ['ai_model', 'manual', 'hybrid'],
    default: 'ai_model'
  },
  analyst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    modelVersion: String,
    processingTime: Number, // in milliseconds
    imageSize: String,
    imageFormat: String
  }
}, {
  timestamps: true
});

// Indexes
freshnessAnalysisSchema.index({ product: 1 });
freshnessAnalysisSchema.index({ createdAt: -1 });
freshnessAnalysisSchema.index({ 'analysisResults.freshnessScore': -1 });

// Instance method to generate recommendations based on score
freshnessAnalysisSchema.methods.generateRecommendations = function() {
  const score = this.analysisResults.freshnessScore;
  const recommendations = [];
  
  if (score >= 90) {
    recommendations.push('Excellent quality! Perfect for immediate consumption or storage.');
    recommendations.push('Store in optimal conditions to maintain freshness.');
  } else if (score >= 80) {
    recommendations.push('Good quality product with minor imperfections.');
    recommendations.push('Consume within 2-3 days for best quality.');
    recommendations.push('Check regularly for any changes in condition.');
  } else if (score >= 60) {
    recommendations.push('Fair quality - suitable for cooking or processing.');
    recommendations.push('Consume within 1-2 days.');
    recommendations.push('Consider using in cooked dishes rather than raw consumption.');
  } else if (score >= 40) {
    recommendations.push('Poor quality - use immediately or discard.');
    recommendations.push('Only suitable for cooking if no visible mold or rot.');
    recommendations.push('Check thoroughly before use.');
  } else {
    recommendations.push('Very poor quality - recommend disposal.');
    recommendations.push('Not suitable for consumption.');
    recommendations.push('May pose health risks if consumed.');
  }
  
  this.analysisResults.recommendations = recommendations;
  return this;
};

module.exports = mongoose.model('FreshnessAnalysis', freshnessAnalysisSchema);