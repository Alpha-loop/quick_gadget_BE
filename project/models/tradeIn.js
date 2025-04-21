// models/TradeIn.js
const tradeInSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceType: String,
  condition: String,
  estimatedValue: Number,
  status: { type: String, default: 'pending' }
});