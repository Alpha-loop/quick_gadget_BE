const Product = require('../models/productModel.js');

const getProducts = async (req, res) => {
  try {
    const { type, brand } = req.query;
    const query = {};
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (req.user && req.query.shopOwner === 'true') {
      query.createdBy = req.user._id; // Filter by shop owner
    }
    const products = await Product.find(query);
    res.json({
      status: 'success',
      results: products.length,
      data: { products },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id, // Link product to the authenticated shop owner
    };
    const product = await Product.create(productData);
    res.status(201).json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({ status: 'error', message: 'Failed to create product' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }
    res.json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you are not authorized',
      });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json({
      status: 'success',
      data: { product },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({ status: 'error', message: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you are not authorized',
      });
    }
    res.json({
      status: 'success',
      message: 'Product deleted',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete product' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};