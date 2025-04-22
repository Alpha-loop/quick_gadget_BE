// routes/payments.js
const express = require('express');
const { createPayment } = require('../controllers/paymentsController');

const router = express.Router();

router.post('/', createPayment);

module.exports = router;