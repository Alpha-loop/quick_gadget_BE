const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { createOrder, getOrders, getOrderById, processPayment } = require('../controllers/orderController');

const router = express.Router();

router.post('/', authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/:id/pay', authMiddleware, processPayment);

module.exports = router;