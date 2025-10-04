const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get customer orders
exports.getCustomerOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.findByCustomer(req.user._id, {
      sort: { createdAt: -1 },
      limit: limit
    }).skip(skip);

    const total = await Order.countDocuments({ customer: req.user._id });

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
    console.error('Get customer orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, deliverySlot, deliveryInstructions } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock availability
    for (const item of cart.items) {
      if (item.product.stock.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      merchant: item.product.merchant,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images[0]?.url || ''
    }));

    // Calculate order summary
    const subtotal = cart.totalAmount;
    const deliveryFee = subtotal >= 50 ? 0 : 5; // Free delivery over $50
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + deliveryFee + tax;

    // Create order
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      orderSummary: {
        subtotal,
        deliveryFee,
        tax,
        total
      },
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        status: 'pending'
      },
      deliverySlot,
      deliveryInstructions,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    });

    await order.save();

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { 'stock.quantity': -item.quantity, sold: item.quantity } }
      );
    }

    // Clear cart
    await cart.clearCart();

    // Populate order details
    await order.populate('items.product', 'name images');

    // Emit real-time notification to merchants
    const io = req.app.get('io');
    const uniqueMerchants = [...new Set(orderItems.map(item => item.merchant.toString()))];
    
    uniqueMerchants.forEach(merchantId => {
      io.to(`merchant_${merchantId}`).emit('new_order', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        customer: req.user.username,
        total: order.orderSummary.total
      });
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that has been shipped or delivered'
      });
    }

    await order.updateStatus('cancelled', 'Cancelled by customer', req.user._id);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { 'stock.quantity': item.quantity, sold: -item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Rate order
exports.rateOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
      status: 'delivered'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    if (order.rating) {
      return res.status(400).json({
        success: false,
        message: 'Order already rated'
      });
    }

    order.rating = rating;
    order.review = review;
    order.reviewedAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: order
    });

  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get merchant orders
exports.getMerchantOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.findByMerchant(req.user._id, {
      sort: { createdAt: -1 },
      limit: limit
    }).skip(skip);

    const total = await Order.countDocuments({ 'items.merchant': req.user._id });

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
    console.error('Get merchant orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update order status (Merchant only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      'items.merchant': req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note, req.user._id);

    // Emit real-time notification to customer
    const io = req.app.get('io');
    io.to(`customer_${order.customer}`).emit('order_status_update', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: status,
      note: note
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update tracking information
exports.updateTracking = async (req, res) => {
  try {
    const { trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findOne({
      _id: req.params.id,
      'items.merchant': req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.trackingNumber = trackingNumber;
    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    await order.save();

    res.json({
      success: true,
      message: 'Tracking information updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};