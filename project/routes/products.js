const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');



router
  .route('/')
  /**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [phone, tablet, laptop, accessory]
 *         description: Filter by category
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *           enum: [new, used, refurbished]
 *         description: Filter by condition
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
  .get(productController.getAllProducts);

router
  .route('/:id')
  /**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
  .get(productController.getProduct);

module.exports = router;