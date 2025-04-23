const mongoose = require('mongoose');

const PaymentRecordSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionReference: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },
  paymentType: {
    type: String,
    enum: ['full', 'installment', 'downpayment'],
    required: true,
  },
});

export const PaymentRecord = mongoose.models.PaymentRecord || mongoose.model('PaymentRecord', PaymentRecordSchema);