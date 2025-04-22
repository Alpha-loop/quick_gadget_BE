// controllers/swapsController.js
const Swap = require('../models/swapModel');

const createSwap = async (req, res) => {
  try {
    const { userId, offeredProductId, requestedProductId } = req.body;
    if (!userId || !offeredProductId || !requestedProductId) {
      return res.status(400).json({ error: 'userId, offeredProductId, and requestedProductId are required' });
    }
    const swap = new Swap({ userId, offeredProductId, requestedProductId });
    await swap.save();
    res.status(201).json({ message: 'Swap request created', data: swap });
  } catch (error) {
    res.status(400).json({ error: 'Swap creation failed' });
  }
};

const getSwaps = async (req, res) => {
  try {
    const swaps = await Swap.find().populate('userId offeredProductId requestedProductId');
    res.json({ status: 'success', results: swaps.length, data: { swaps } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch swaps' });
  }
};

module.exports = { createSwap, getSwaps };