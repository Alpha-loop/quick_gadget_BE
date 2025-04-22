const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  credit_score: { type: Number, default: null },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);