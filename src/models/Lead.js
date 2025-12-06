
const mongoose = require("mongoose");

// Transaction item schema
const TransactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentMode: { type: String },
  date: { type: String },
  timestamp: { type: String },
  remarks: { type: String } // ⭐ NEW: Remarks for paid amount transactions
});

// Case completion schema
const CaseCompletionSchema = new mongoose.Schema({
  completed: { type: Boolean, default: false },
  date: { type: Date },
  result: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" }
});

// Main Lead Schema
const LeadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },

  buyerName: { type: String },
  sellerName: { type: String },

  propertyLocation: { type: String },
  docType: { type: String },
  docNo: { type: String },
  docDate: { type: Date },
  status: { type: String },

  stampDuty: { type: Number, default: 0 },
  registrationFees: { type: Number, default: 0 },

  registrarCommission: { type: Number, default: 0 },
  agentCommission: { type: Number, default: 0 },

  // ⭐ NEW: Stationery Expenses Field ⭐
  stationeryExpenses: { type: Number, default: 0 },

  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },

  fuelpaymentType: { type: String },
  paymentMode: { type: String },

  fuelAmount: { type: Number, default: 0 },
  remarks: { type: String },

  // NEW: Transaction histories
  stampDutyTransactions: [TransactionSchema],
  registrationFeesTransactions: [TransactionSchema],

  // ⭐ PAID AMOUNT HISTORY WITH REMARKS ⭐
  paidAmountTransactions: [TransactionSchema],

  // Completion section
  markCompleted: { type: Boolean, default: false },
  completionDate: { type: Date },
  finalOutcome: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" },

  duePaymentDate: { type: Date },

  // ⭐ OPTIONAL LOAN SECTION ⭐
  hasLoan: { type: Boolean, default: false },
  loanAmount: { type: Number, default: null },
  tenureMonths: { type: Number, default: null },
  interestRate: { type: Number, default: null },
  agreementUpload: { type: String, default: null },
  loanDescription: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto update timestamp
LeadSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Lead", LeadSchema);