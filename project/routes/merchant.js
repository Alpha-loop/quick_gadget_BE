const express = require('express');
const authMiddleware = require('../middlewares/auth');
const merchantMiddleware = require('../middlewares/merchant');
const { getDashboard, getProducts, getOrders, getPayments } = require('../controllers/merchantController');

const router = express.Router();

router.get('/dashboard', [authMiddleware, merchantMiddleware], getDashboard);
router.get('/products', [authMiddleware, merchantMiddleware], getProducts);
router.get('/orders', [authMiddleware, merchantMiddleware], getOrders);
router.get('/payments', [authMiddleware, merchantMiddleware], getPayments);

module.exports = router;