// controllers/orderController.js
const Order = require('../models/order');
const AppError = require('../utils/appError');

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: { orders }
    });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { order: newOrder }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(new AppError('No order found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!order) {
      return next(new AppError('No order found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

// In orderController.js
exports.createInstallmentOrder = async (req, res) => {
  const { productId, months } = req.body;
  
  const product = await Product.findById(productId);
  const monthlyPayment = calculateInstallment(product.price, months);

  const order = await Order.create({
    user: req.user.id,
    product: productId,
    installments: { months, monthlyPayment }
  });

  res.status(201).json(order);
};

// controllers/orderController.js
exports.calculateInstallment = async (req, res) => {
  const { productId, months } = req.body;
  
  const product = await Product.findById(productId);
  const interestRates = { 3: 0.05, 6: 0.08, 12: 0.12 };
  const interestRate = interestRates[months] || 0.15;
  
  const monthlyPayment = (product.price * (1 + interestRate)) / months;

  res.json({
    product: product.name,
    originalPrice: product.price,
    months,
    interestRate: `${interestRate * 100}%`,
    monthlyPayment: monthlyPayment.toFixed(2),
    totalPayment: (monthlyPayment * months).toFixed(2)
  });
};

// Make sure this is at the end
module.exports = exports;