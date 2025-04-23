const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  role:  {
    type: String,
    enum: ['customer', 'admin', 'merchant'],
    default: 'customer',
  },
  address: {
    street: String,
    city: String,
    state: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite by checking if model exists
module.exports = mongoose.models.User || mongoose.model('User', userSchema);