const mongoose = require("mongoose");

const PaymentHistorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentMode: {
    type: String,
    enum: ["cash", "upi", "bank", "cheque", "other"],
    required: true,
  },

  purpose: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  },

  remark: {
    type: String,
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentHistory", PaymentHistorySchema);
