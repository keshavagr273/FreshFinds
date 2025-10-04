const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get customer dashboard
exports.getCustomerDashboard = async (req, res) => {
  try {
    const customerId = req.user._id;

    // Get recent orders
    const recentOrders = await Order.find({ customer: customerId })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get order stats
    const totalOrders = await Order.countDocuments({ customer: customerId });
    const pendingOrders = await Order.countDocuments({ 
      customer: customerId,
      status: { $in: ['pending', 'confirmed', 'processing'] }
    });
    const completedOrders = await Order.countDocuments({ 
      customer: customerId,
      status: 'delivered'
    });

    // Calculate total spent
    const allOrders = await Order.find({ 
      customer: customerId,
      status: 'delivered'
    });
    const totalSpent = allOrders.reduce((total, order) => 
      total + order.orderSummary.total, 0
    );

    // Get recommended products (based on user's order history)
    const orderHistory = await Order.find({ customer: customerId })
      .populate('items.product', 'category');
    
    const preferredCategories = {};
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        if (item.product && item.product.category) {
          preferredCategories[item.product.category] = 
            (preferredCategories[item.product.category] || 0) + 1;
        }
      });
    });

    const topCategories = Object.entries(preferredCategories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    const recommendedProducts = await Product.find({
      category: { $in: topCategories },
      status: 'active'
    })
    .populate('merchant', 'username storeName')
    .sort({ 'rating.average': -1 })
    .limit(8);

    // Get featured products if no recommendations
    let featuredProducts = [];
    if (recommendedProducts.length < 4) {
      featuredProducts = await Product.find({
        status: 'active',
        featured: true
      })
      .populate('merchant', 'username storeName')
      .sort({ 'rating.average': -1 })
      .limit(8);
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          completedOrders,
          totalSpent: Math.round(totalSpent * 100) / 100
        },
        recentOrders,
        recommendedProducts: recommendedProducts.length > 0 ? 
          recommendedProducts : featuredProducts,
        preferredCategories: topCategories
      }
    });

  } catch (error) {
    console.error('Get customer dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get admin dashboard (if needed)
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get overall platform stats
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalMerchants = await User.countDocuments({ role: 'merchant' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('username email role createdAt');

    const recentOrders = await Order.find()
      .populate('customer', 'username email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate platform revenue
    const allOrders = await Order.find({ status: 'delivered' });
    const totalRevenue = allOrders.reduce((total, order) => 
      total + order.orderSummary.total, 0
    );

    // Get category breakdown
    const categoryStats = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSold: { $sum: '$sold' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalCustomers,
          totalMerchants,
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100
        },
        recentUsers,
        recentOrders,
        categoryStats
      }
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};