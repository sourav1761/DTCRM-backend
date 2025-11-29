// const mongoose = require("mongoose");

// const WalletTransactionSchema = new mongoose.Schema({
//   type: { type: String, enum: ["deposit","withdraw"], required: true },
//   amount: { type: Number, required: true },
//   method: { type: String }, // manual or auto/from lead
//   reference: { type: String },
//   lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" }, // optional link to lead payment
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);


const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["deposit", "withdraw"], required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  reference: { type: String },
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
