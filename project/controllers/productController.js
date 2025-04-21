const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, condition } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ status: 'error', message: 'Please provide name, price, and category' });
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      condition: condition || 'new',
    });

    res.status(201).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};