const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const FreshnessAnalysis = require('../models/FreshnessAnalysis');

// Get merchant dashboard overview
exports.getDashboard = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Get basic stats
    const totalProducts = await Product.countDocuments({ 
      merchant: merchantId, 
      status: { $ne: 'discontinued' } 
    });

    const activeProducts = await Product.countDocuments({ 
      merchant: merchantId, 
      status: 'active' 
    });

    const outOfStock = await Product.countDocuments({ 
      merchant: merchantId, 
      status: 'out_of_stock' 
    });

    // Get orders stats
    const totalOrders = await Order.countDocuments({ 
      'items.merchant': merchantId 
    });

    const pendingOrders = await Order.countDocuments({ 
      'items.merchant': merchantId,
      status: { $in: ['pending', 'confirmed'] }
    });

    const completedOrders = await Order.countDocuments({ 
      'items.merchant': merchantId,
      status: 'delivered'
    });

    // Calculate revenue (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.find({
      'items.merchant': merchantId,
      status: 'delivered',
      createdAt: { $gte: startOfMonth }
    });

    const monthlyRevenue = monthlyOrders.reduce((total, order) => {
      const merchantItems = order.items.filter(item => 
        item.merchant.toString() === merchantId.toString()
      );
      return total + merchantItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    }, 0);

    // Get recent orders
    const recentOrders = await Order.find({
      'items.merchant': merchantId
    })
    .populate('customer', 'username email')
    .sort({ createdAt: -1 })
    .limit(5);

    // Get low stock products
    const lowStockProducts = await Product.find({
      merchant: merchantId,
      'stock.quantity': { $lte: 5 },
      status: 'active'
    }).limit(5);

    // Get top selling products
    const topProducts = await Product.find({
      merchant: merchantId,
      status: 'active'
    })
    .sort({ sold: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalProducts,
          activeProducts,
          outOfStock,
          totalOrders,
          pendingOrders,
          completedOrders,
          monthlyRevenue: Math.round(monthlyRevenue * 100) / 100
        },
        recentOrders,
        lowStockProducts,
        topProducts
      }
    });

  } catch (error) {
    console.error('Get merchant dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get merchant products
exports.getMyProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    let query = { merchant: req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

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
    console.error('Get my products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get merchant orders
exports.getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'all';

    let query = { 'items.merchant': req.user._id };
    if (status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer', 'username email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get merchant customers
exports.getMyCustomers = async (req, res) => {
  try {
    const merchantId = req.user._id;

    // Get unique customers who have ordered from this merchant
    const orders = await Order.find({
      'items.merchant': merchantId,
      status: { $in: ['delivered', 'shipped'] }
    }).populate('customer', 'username email phone lastLogin');

    // Extract unique customers
    const customerMap = new Map();
    let totalRevenue = 0;
    let totalOrders = 0;

    orders.forEach(order => {
      const customerId = order.customer._id.toString();
      const merchantItems = order.items.filter(item => 
        item.merchant.toString() === merchantId.toString()
      );
      const orderValue = merchantItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      if (customerMap.has(customerId)) {
        const existing = customerMap.get(customerId);
        existing.totalSpent += orderValue;
        existing.orderCount += 1;
        existing.lastOrder = order.createdAt > existing.lastOrder ? 
          order.createdAt : existing.lastOrder;
      } else {
        customerMap.set(customerId, {
          customer: order.customer,
          totalSpent: orderValue,
          orderCount: 1,
          lastOrder: order.createdAt
        });
      }

      totalRevenue += orderValue;
      totalOrders += 1;
    });

    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent);

    res.json({
      success: true,
      data: {
        customers,
        summary: {
          totalCustomers: customers.length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? 
            Math.round((totalRevenue / totalOrders) * 100) / 100 : 0
        }
      }
    });

  } catch (error) {
    console.error('Get my customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const merchantId = req.user._id;
    const { period = '30' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Sales analytics
    const orders = await Order.find({
      'items.merchant': merchantId,
      status: 'delivered',
      createdAt: { $gte: startDate }
    });

    // Calculate daily sales
    const dailySales = {};
    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      const merchantItems = order.items.filter(item => 
        item.merchant.toString() === merchantId.toString()
      );
      const dayRevenue = merchantItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );

      if (dailySales[date]) {
        dailySales[date] += dayRevenue;
      } else {
        dailySales[date] = dayRevenue;
      }

      totalRevenue += dayRevenue;
    });

    // Product performance
    const productPerformance = await Product.aggregate([
      { $match: { merchant: merchantId, status: 'active' } },
      { 
        $project: {
          name: 1,
          sold: 1,
          views: 1,
          'rating.average': 1,
          'stock.quantity': 1
        }
      },
      { $sort: { sold: -1 } },
      { $limit: 10 }
    ]);

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $match: { merchant: merchantId, status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalSold: { $sum: '$sold' },
          avgRating: { $avg: '$rating.average' }
        }
      },
      { $sort: { totalSold: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalOrders,
          averageOrderValue: totalOrders > 0 ? 
            Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
          period: parseInt(period)
        },
        dailySales: Object.entries(dailySales).map(([date, revenue]) => ({
          date,
          revenue: Math.round(revenue * 100) / 100
        })),
        productPerformance,
        categoryBreakdown
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get low stock products
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;

    const lowStockProducts = await Product.find({
      merchant: req.user._id,
      'stock.quantity': { $lte: threshold },
      status: 'active'
    }).sort({ 'stock.quantity': 1 });

    res.json({
      success: true,
      data: lowStockProducts
    });

  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update store settings
exports.updateStoreSettings = async (req, res) => {
  try {
    const allowedUpdates = [
      'storeName', 'storeDescription', 'address', 'phone'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Store settings updated successfully',
      data: {
        storeName: user.storeName,
        storeDescription: user.storeDescription,
        address: user.address,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Update store settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};