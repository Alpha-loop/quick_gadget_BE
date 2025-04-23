const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      paymentMethod: {
        type: String,
        required: true,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      installmentPlan: {
        enabled: {
          type: Boolean,
          default: false,
        },
        months: {
          type: Number,
          default: 0,
        },
        monthlyPayment: {
          type: Number,
          default: 0,
        },
        downPayment: {
          type: Number,
          default: 0,
        },
        shippingAddress: {
          street: String,
          city: String,
          state: String,
        },
        status: {
          type: String,
          enum: ['processing', 'shipped', 'delivered', 'cancelled'],
          default: 'processing',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    },
  ],
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);