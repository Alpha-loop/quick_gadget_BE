// controllers/paymentsController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || !orderId) {
      return res.status(400).json({ error: 'Amount and orderId are required' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { orderId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

module.exports = { createPayment };