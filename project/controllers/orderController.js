const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const axios = require('axios');

const createOrder = async (req, res) => {
  try {
    const {
      products,
      paymentMethod,
      installmentPlan,
      shippingAddress,
    } = req.body;
    // Validate input
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of products with productId and quantity',
      });
    }
    if (!paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a payment method',
      });
    }

    // Fetch products
    const productIds = products.map((item) => item.productId);
    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length !== productIds.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more products not found',
      });
    }

    // Calculate totals and map products
    const orderProducts = products.map((item) => {
      const product = foundProducts.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      const totalAmount = product.price * item.quantity;
      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        installmentPlan: installmentPlan || {
          enabled: false,
          months: 0,
          monthlyPayment: 0,
          downPayment: 0,
          shippingAddress: shippingAddress || {},
          status: 'processing',
          createdAt: new Date(),
        },
      };
    });

    // Create order
    const order = await Order.create({
      customer: req.user._id,
      products: orderProducts,
    });

    res.status(201).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create order',
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'buyer') {
      query.customer = req.user._id; // Buyers see their own orders
    } else if (req.user.role === 'shopOwner') {
      // Shop owners see orders containing their products
      const shopProducts = await Product.find({ createdBy: req.user._id }).select('_id');
      const productIds = shopProducts.map((p) => p._id);
      query['products.product'] = { $in: productIds };
    } else {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to view orders',
      });
    }

    const orders = await Order.find(query).populate('products.product customer');
    res.json({
      status: 'success',
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product customer');
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Restrict access to the order's customer or shop owner
    const shopProducts = await Product.find({ createdBy: req.user._id }).select('_id');
    const shopProductIds = shopProducts.map((p) => p._id.toString());
    const orderProductIds = order.products.map((p) => p.product._id.toString());
    const isShopOwner = orderProductIds.some((id) => shopProductIds.includes(id));

    if (
      order.customer._id.toString() !== req.user._id.toString() &&
      !isShopOwner
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to view this order',
      });
    }

    res.json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch order',
    });
  }
};

const processPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found',
      });
    }

    // Restrict to the order's customer
    if (order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Unauthorized to process payment for this order',
      });
    }

    // Calculate total amount from products
    const totalAmount = order.products.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    if (order.products.some((item) => item.paymentStatus === 'completed')) {
      return res.status(400).json({
        status: 'error',
        message: 'Order is already paid',
      });
    }

    // Mock Paystack payment initialization
    // TODO: Replace with actual Paystack integration
    const paymentResponse = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: totalAmount * 100, // Paystack expects amount in kobo
        reference: `order_${order._id}_${Date.now()}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // Update payment status for all products
    order.products.forEach((item) => {
      item.paymentStatus = 'completed';
    });
    await order.save();

    res.json({
      status: 'success',
      data: {
        order,
        paymentUrl: paymentResponse.data.data.authorization_url, // Redirect buyer to this URL
      },
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process payment',
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  processPayment,
};