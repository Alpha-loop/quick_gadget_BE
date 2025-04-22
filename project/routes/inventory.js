// routes/inventory.js
const express = require('express');
const { updateStock, getStock } = require('../controllers/inventoryController');

const router = express.Router();

router.patch('/:productId', updateStock); // Update stock for a product
router.get('/:productId', getStock); // Get stock for a product

module.exports = router;