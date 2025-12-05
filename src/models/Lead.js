
// const mongoose = require("mongoose");

// // Transaction item schema
// const TransactionSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   amount: { type: Number, required: true },
//   paymentMode: { type: String },     // ⭐ NEW
//   date: { type: String },
//   timestamp: { type: String }
// });

// // Case completion schema
// const CaseCompletionSchema = new mongoose.Schema({
//   completed: { type: Boolean, default: false },
//   date: { type: Date },
//   result: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" }
// });

// // Main Lead Schema
// const LeadSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   phone: { type: String, required: true },

//   buyerName: { type: String },
//   sellerName: { type: String },

//   propertyLocation: { type: String },
//   docType: { type: String },
//   docNo: { type: String },
//   docDate: { type: Date },
//   status: { type: String },

//   stampDuty: { type: Number, default: 0 },
//   registrationFees: { type: Number, default: 0 },

//   registrarCommission: { type: Number, default: 0 },
//   agentCommission: { type: Number, default: 0 },

//   // remove old paidAmount system
//   paidAmount: { type: Number, default: 0 }, // automatically calculated
//   dueAmount: { type: Number, default: 0 },

//   // remove old paymentMode
//   fuelpaymentType: { type: String },
//   paymentMode: { type: String },  // optional - but not used now for history

//   fuelAmount: { type: Number, default: 0 },
//   remarks: { type: String },

//   // NEW: Transaction histories
//   stampDutyTransactions: [TransactionSchema],
//   registrationFeesTransactions: [TransactionSchema],

//   // ⭐ NEW PAID AMOUNT HISTORY ⭐
//   paidAmountTransactions: [TransactionSchema],

//   // Completion section
//   markCompleted: { type: Boolean, default: false },
//   completionDate: { type: Date },
//   finalOutcome: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" },

//   duePaymentDate: { type: Date },

//   // ⭐ OPTIONAL LOAN SECTION ⭐
//   hasLoan: { type: Boolean, default: false },
//   loanAmount: { type: Number, default: null },
//   tenureMonths: { type: Number, default: null },
//   interestRate: { type: Number, default: null },
//   agreementUpload: { type: String, default: null },
//   loanDescription: { type: String, default: "" },

//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Auto update timestamp
// LeadSchema.pre("save", function () {
//   this.updatedAt = Date.now();
// });

// module.exports = mongoose.model("Lead", LeadSchema);




const mongoose = require("mongoose");

// Transaction item schema (Updated with remarks)
const TransactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentMode: { type: String },
  date: { type: String },
  timestamp: { type: String },
  remarks: { type: String, default: "" } // ⭐ ADDED FOR REMARKS IN PAYMENTS
});

// Case completion schema
const CaseCompletionSchema = new mongoose.Schema({
  completed: { type: Boolean, default: false },
  date: { type: Date },
  result: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" }
});

// Stationary Expenses Schema
const StationaryExpenseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  itemName: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String },
  remarks: { type: String }
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

  // ⭐ NEW: STATIONERY EXPENSES FIELD
  stationeryExpenses: [StationaryExpenseSchema],
  stationeryTotal: { type: Number, default: 0 }, // Auto-calculated

  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number, default: 0 },

  fuelpaymentType: { type: String },
  paymentMode: { type: String },

  fuelAmount: { type: Number, default: 0 },
  remarks: { type: String },

  // Transaction histories
  stampDutyTransactions: [TransactionSchema],
  registrationFeesTransactions: [TransactionSchema],
  paidAmountTransactions: [TransactionSchema],

  // Completion section
  markCompleted: { type: Boolean, default: false },
  completionDate: { type: Date },
  finalOutcome: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" },

  duePaymentDate: { type: Date },

  // OPTIONAL LOAN SECTION
  hasLoan: { type: Boolean, default: false },
  loanAmount: { type: Number, default: null },
  tenureMonths: { type: Number, default: null },
  interestRate: { type: Number, default: null },
  agreementUpload: { type: String, default: null },
  loanDescription: { type: String, default: "" },

  // ⭐ NEW: ESTIMATED RETURNS FROM STAMP DUTY (1.5%)
  estimatedReturns: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to auto-calculate totals before save
LeadSchema.pre("save", function (next) {
  // Calculate stationery total
  this.stationeryTotal = this.stationeryExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0), 0
  );

  // Calculate estimated returns (1.5% of stamp duty total)
  const stampDutyTotal = this.stampDutyTransactions.reduce(
    (sum, transaction) => sum + Number(transaction.amount || 0), 0
  );
  this.estimatedReturns = stampDutyTotal * 0.015; // 1.5%

  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Lead", LeadSchema);