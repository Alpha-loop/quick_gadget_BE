const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const getDashboard = async (req, res) => {
  try {
    // Get total products
    const totalProducts = await Product.countDocuments({ createdBy: req.user._id });

    // Get total orders
    const shopProducts = await Product.find({ createdBy: req.user._id }).select('_id');
    const productIds = shopProducts.map((p) => p._id);
    const totalOrders = await Order.countDocuments({ 'products.product': { $in: productIds } });

    // Get total sales and payment stats
    const orders = await Order.find({ 'products.product': { $in: productIds } });
    const totalSales = orders.reduce((sum, order) => {
      const orderTotal = order.products.reduce((orderSum, item) => {
        if (productIds.includes(item.product)) {
          return orderSum + item.totalAmount;
        }
        return orderSum;
      }, 0);
      return sum + orderTotal;
    }, 0);
    const completedPayments = orders.filter((order) =>
      order.products.some((item) => item.paymentStatus === 'completed')
    ).length;

    res.json({
      status: 'success',
      data: {
        dashboard: {
          totalProducts,
          totalOrders,
          totalSales,
          completedPayments,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch dashboard data',
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id });
    res.json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const shopProducts = await Product.find({ createdBy: req.user._id }).select('_id');
    const productIds = shopProducts.map((p) => p._id);
    const orders = await Order.find({ 'products.product': { $in: productIds } }).populate(
      'products.product customer'
    );
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

const getPayments = async (req, res) => {
  try {
    const shopProducts = await Product.find({ createdBy: req.user._id }).select('_id');
    const productIds = shopProducts.map((p) => p._id);
    const orders = await Order.find({ 'products.product': { $in: productIds } }).populate(
      'products.product customer'
    );

    const payments = orders
      .filter((order) => order.products.some((item) => productIds.includes(item.product)))
      .map((order) => {
        const relevantProducts = order.products.filter((item) =>
          productIds.includes(item.product)
        );
        return {
          orderId: order._id,
          customer: order.customer.email,
          products: relevantProducts.map((item) => ({
            product: item.product.name,
            quantity: item.quantity,
            totalAmount: item.totalAmount,
            paymentStatus: item.paymentStatus,
          })),
          paymentMethod: relevantProducts[0].paymentMethod,
          createdAt: relevantProducts[0].installmentPlan.createdAt,
        };
      });

    res.json({
      status: 'success',
      results: payments.length,
      data: { payments },
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch payments',
    });
  }
};

module.exports = {
  getDashboard,
  getProducts,
  getOrders,
  getPayments,
};