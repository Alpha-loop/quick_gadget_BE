const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price must be positive'],
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['phone', 'tablet', 'laptop', 'accessory'],
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;