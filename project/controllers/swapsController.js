// controllers/swapsController.js
const mongoose = require('mongoose');
const Swap = require('../models/swapModel');
const User = require('../models/userModel');
const Product = require('../models/productModel');

const createSwap = async (req, res) => {
  try {
    const { userId, offeredProductId, requestedProductId } = req.body;

    // Validate ObjectIDs
    if (!mongoose.isValidObjectId(userId) ||
        !mongoose.isValidObjectId(offeredProductId) ||
        !mongoose.isValidObjectId(requestedProductId)) {
      return res.status(400).json({ error: 'Invalid userId, offeredProductId, or requestedProductId' });
    }

    // Validate existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const offeredProduct = await Product.findById(offeredProductId);
    const requestedProduct = await Product.findById(requestedProductId);
    if (!offeredProduct || !requestedProduct) {
      return res.status(404).json({ error: 'One or both products not found' });
    }

    // Ensure authenticated user matches userId
    if (req.user && req.user.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized to create swap for this user' });
    }

    const swap = new Swap({ userId, offeredProductId, requestedProductId });
    await swap.save();
    res.status(201).json({ message: 'Swap request created', data: swap });
  } catch (error) {
    res.status(400).json({ error: 'Swap creation failed: ' + error.message });
  }
};

const getSwaps = async (req, res) => {
  try {
    // Filter by authenticated user if available
    const query = req.user ? { userId: req.user.userId } : {};
    const swaps = await Swap.find(query).populate('userId offeredProductId requestedProductId');
    res.json({ status: 'success', results: swaps.length, data: { swaps } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swaps: ' + error.message });
  }
};

module.exports = { createSwap, getSwaps };