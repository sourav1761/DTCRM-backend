const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
  clientName: { type: String },
  lastPaymentDate: { type: Date },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },
  paymentMode: { type: String },
  status: { type: String, enum: ["fully_paid","partial","overdue"], default: "partial" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
