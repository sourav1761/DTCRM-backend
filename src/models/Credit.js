const mongoose = require("mongoose");

const CreditSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["account_credit", "loan"],
    required: true,
  },

  // account_credit fields
  accountNumber: String,
  bank: String,
  creditAmount: Number,
  note: String,

  // loan fields
  clientName: String,
  loanAmount: Number,
  interestRate: Number,
  tenureMonths: Number,
  agreementFiles: [String],
  description: String,

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Credit", CreditSchema);
