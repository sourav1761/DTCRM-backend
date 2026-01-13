const mongoose = require("mongoose");

const AssociatePaymentSchema = new mongoose.Schema({
  associateName: { type: String, required: true }, // ✅ store name directly

  date: { type: Date, required: true },

  amount: { type: Number, required: true },

  paymentMode: {
    type: String,
    enum: ["cash", "upi", "bank", "cheque", "other"],
    default: "cash",
  },

  remark: { type: String },

  leadId: { type: String }, // optional

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AssociatePayment", AssociatePaymentSchema);
