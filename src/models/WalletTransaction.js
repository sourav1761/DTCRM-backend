
// const mongoose = require("mongoose");

// const WalletTransactionSchema = new mongoose.Schema({
//   type: { 
//     type: String, 
//     enum: ["deposit", "withdraw", "estimated_return"], // ⭐ NEW: Added estimated_return type
//     required: true 
//   },
//   amount: { type: Number, required: true },
//   method: { type: String },
//   reference: { type: String },
//   lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
//   autoDeduct: { type: Boolean, default: false },
//   autoRefund: { type: Boolean, default: false },
//   // ⭐ NEW: Track if this is stamp duty related for estimated returns calculation
//   isStampDuty: { type: Boolean, default: false },
//   // ⭐ NEW: Track estimated returns separately
//   estimatedReturnAdded: { type: Boolean, default: false },
//   estimatedReturnAmount: { type: Number, default: 0 },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);


const mongoose = require("mongoose");

const WalletTransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["deposit", "withdraw"],
    required: true,
  },

  amount: { type: Number, required: true },

  method: { type: String },
  reference: { type: String },

  autoDeduct: { type: Boolean, default: false },
  autoRefund: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WalletTransaction", WalletTransactionSchema);
