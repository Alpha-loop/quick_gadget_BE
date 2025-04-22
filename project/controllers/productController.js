// controllers/productController.js
const Product = require('../models/productModel.js');

const getProducts = async (req, res) => {
  try {
    const { type, brand } = req.query;
    const query = {};
    if (type) query.type = type;
    if (brand) query.brand = brand;
    const products = await Product.find(query);
    res.json({ status: 'success', results: products.length, data: { products } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product added', data: product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add product' });
  }
};

module.exports = { getProducts, addProduct };