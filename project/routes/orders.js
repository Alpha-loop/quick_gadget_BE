const express = require('express');
const router = express.Router(); // Use Express Router instead
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

// Protect all routes
router.use(authController.protect);

router
  .route('/')
  /**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (protected)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 */
  .get(orderController.getAllOrders)
  /**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (protected)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - months
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product being ordered
 *               months:
 *                 type: number
 *                 description: Installment duration in months
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder);

module.exports = router;