const express = require('express');
const { getProducts, addProduct } = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', getProducts);
router.post('/', authMiddleware, addProduct); // Protected

module.exports = router;