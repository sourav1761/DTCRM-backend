const mongoose = require("mongoose");

const CreditHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ["account_credit", "loan"], required: true },
  amount: Number,
  note: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CreditHistory", CreditHistorySchema);
