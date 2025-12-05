const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["deposit", "withdraw"], required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  reference: { type: String },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  autoDeduct: { type: Boolean, default: false }, // NEW: Track auto deductions
  autoRefund: { type: Boolean, default: false }, // NEW: Track auto refunds
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);