const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['new', 'used'], required: true },
  category: { type: String, enum: ['phone', 'gadget'], required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  specifications: { type: Object, default: {} },
  condition: { type: String }, // For used items
  stock: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);