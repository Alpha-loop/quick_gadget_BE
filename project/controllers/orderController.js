const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { product, installments } = req.body;
    if (!product) {
      return res.status(400).json({ status: 'error', message: 'Please provide product ID' });
    }

    const order = await Order.create({
      product,
      user: req.user._id,
      installments,
      status: 'pending',
    });

    res.status(201).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};