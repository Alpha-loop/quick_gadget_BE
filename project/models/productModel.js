// models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
  },
  type: {
    type: String,
    enum: ['new', 'used'],
    required: [true, 'Please specify product type (new/used)'],
  },
  category: {
    type: String,
    enum: ['phone', 'gadget'],
    required: [true, 'Please specify category (phone/gadget)'],
  },
  brand: {
    type: String,
    required: [true, 'Please provide brand'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
  },
  specifications: {
    type: Object,
    default: {},
  },
  condition: {
    type: String,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);