// routes/tradeins.js
/**
 * @swagger
 * /api/tradeins:
 *   post:
 *     summary: Submit a device for trade-in valuation
 *     tags: [TradeIns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceType: { type: string, example: "iPhone 12" }
 *               condition: { type: string, example: "good" }
 *               specs: { type: object }
 *     responses:
 *       201:
 *         description: Trade-in valuation received
 */
router.post('/', tradeInController.createTradeIn);