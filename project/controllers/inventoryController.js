// controllers/inventoryController.js
const Product = require('../models/productModel');

const updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;
    if (stock === undefined || stock < 0) {
      return res.status(400).json({ error: 'Valid stock value is required' });
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Stock updated', data: product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
};

const getStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).select('name stock');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ status: 'success', data: product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock' });
  }
};

module.exports = { updateStock, getStock };