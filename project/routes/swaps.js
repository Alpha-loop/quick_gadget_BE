// routes/swaps.js
const express = require('express');
const { createSwap, getSwaps } = require('../controllers/swapsController');

const router = express.Router();

router.post('/', createSwap); // Create a swap request
router.get('/', getSwaps); // Get all swap requests (e.g., for admin or user)

module.exports = router;