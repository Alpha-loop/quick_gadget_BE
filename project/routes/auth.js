const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: securePassword123 }
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 token: { type: string }
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Incorrect email or password
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, passwordConfirm]
 *             properties:
 *               name: { type: string, example: Test User }
 *               email: { type: string, example: user@example.com }
 *               password: { type: string, example: securePassword123 }
 *               passwordConfirm: { type: string, example: securePassword123 }
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 token: { type: string }
 *                 data: { type: object, properties: { user: { type: object } } }
 *       400:
 *         description: Invalid input
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data: { type: object, properties: { user: { type: object } } }
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authController.protect, authController.getMe);

module.exports = router;