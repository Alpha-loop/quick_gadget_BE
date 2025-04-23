const express = require('express');
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/auth');
const merchantMiddleware = require('../middlewares/merchant');

const router = express.Router();

router.get('/', getProducts);
router.post('/', [authMiddleware, merchantMiddleware], createProduct);
router.get('/:id', getProductById);
router.put('/:id', [authMiddleware, merchantMiddleware], updateProduct);
router.delete('/:id', [authMiddleware, merchantMiddleware], deleteProduct);

module.exports = router;