// controllers/tradeInController.js
exports.valuateDevice = async (req, res) => {
  const { deviceType, condition, specs } = req.body;
  
  // AI-powered valuation algorithm
  const baseValues = {
    'iPhone 12': { new: 500, good: 350, fair: 200 },
    'Galaxy S21': { new: 450, good: 300, fair: 150 }
  };

  const estimatedValue = baseValues[deviceType]?.[condition] || 0;
  
  const tradeIn = await TradeIn.create({
    user: req.user._id,
    deviceType,
    condition,
    specs,
    estimatedValue,
    status: 'pending'
  });

  res.status(200).json(tradeIn);
};