const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['phone', 'tablet', 'laptop', 'accessory'],
    required: true 
  },
  price: { type: Number, required: true },
  condition: { 
    type: String, 
    enum: ['new', 'used', 'refurbished'],
    required: true 
  },
  images: [String],
  specs: {
    brand: String,
    model: String,
    storage: String,
    ram: String,
    color: String
  },
  installmentPlans: [{
    months: { type: Number, required: true },
    interestRate: { type: Number, required: true }
  }],
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);