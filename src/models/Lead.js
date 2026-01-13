
// const mongoose = require("mongoose");

// // Transaction item schema
// const TransactionSchema = new mongoose.Schema({
//   id: { type: Number, required: true },
//   amount: { type: Number, required: true },

//   // ⭐ ADD THIS FOR STATIONERY DESCRIPTION ⭐
//   description: { type: String },

//   paymentMode: { type: String },
//   date: { type: String },
//   timestamp: { type: String },
//   remarks: { type: String } // Remarks used for other transactions
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

//   // ⭐ STATIONERY EXPENSES
//   stationeryExpenses: { type: Number, default: 0 },

//   paidAmount: { type: Number, default: 0 },
//   dueAmount: { type: Number, default: 0 },

//   fuelpaymentType: { type: String },
//   paymentMode: { type: String },

//   fuelAmount: { type: Number, default: 0 },
//   remarks: { type: String },

//   // ⭐ TRANSACTION HISTORIES
//   stampDutyTransactions: [TransactionSchema],
//   registrationFeesTransactions: [TransactionSchema],
//   stationeryTransactions: [TransactionSchema],   // ⭐ This now supports description
//   paidAmountTransactions: [TransactionSchema],

//   // ⭐ COMPLETION SECTION
//   markCompleted: { type: Boolean, default: false },
//   completionDate: { type: Date },
//   finalOutcome: { type: String, enum: ["SUCCESSFUL", "UNSUCCESSFUL", ""], default: "" },

//   duePaymentDate: { type: Date },

//   // ⭐ LOAN SECTION
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

// ================= SCHEMAS =================

const CommissionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"], required: true },
  remarks: { type: String }
});

const OtherFeeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

const PaymentTransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"], required: true },
  purpose: { type: String },
  remarks: { type: String }
});

const DocumentUploadSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const LoanFacilitySchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  clientName: String,
  aadharNumber: String,
  phoneNumber: String,
  documentUploads: [DocumentUploadSchema],
  loanAmount: Number,
  extraFee: Number,
  loanDate: Date,
  totalTakenAmount: Number,
  givenOrPendingDate: Date
});

const PartySchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  email: String,
  aadhar: String,
  pan: String
});

// ================= MAIN SCHEMA =================

const LeadSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: String,
  address: String,
  reference: { type: String, enum: ["direct", "agent"], default: "direct" },
  agentName: String,
  firstAmount: Number,
  documentType: String,
  leadDate: { type: Date, required: true },
  stepCompleted: { type: Number, default: 1 },

  loanFacility: { type: LoanFacilitySchema, default: null },

  partyType: { type: String, enum: ["buyer", "seller", "individual", "both"], default: "individual" },
  buyer: PartySchema,
  seller: PartySchema,
  individual: PartySchema,

  propertyLocation: String,
  documentNumber: String,
  documentStartingDate: Date,
  documentStatus: { type: String, default: "Draft" },
  documentUploads: [DocumentUploadSchema],

  stampDuty: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  mutationFee: { type: Number, default: 0 },
  otherFees: [OtherFeeSchema],
  officeFee: { type: Number, default: 0 },
  registrarCommission: [CommissionSchema],
  agentCommission: [CommissionSchema],
  paidTransactions: [PaymentTransactionSchema],
  pendingTransactions: [PaymentTransactionSchema],

  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },

  completionDate: Date,
  successStatus: { type: String, default: "Pending" },
  finalRemarks: String,

  leadStatus: { type: String, default: "New" },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date
});

// ================= PRE SAVE (NO next) =================

LeadSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  let total = 0;
  total += this.stampDuty || 0;
  total += this.registrationFee || 0;
  total += this.mutationFee || 0;
  total += this.officeFee || 0;

  if (this.otherFees?.length) {
    total += this.otherFees.reduce((s, f) => s + (f.amount || 0), 0);
  }
  if (this.registrarCommission?.length) {
    total += this.registrarCommission.reduce((s, c) => s + (c.amount || 0), 0);
  }
  if (this.agentCommission?.length) {
    total += this.agentCommission.reduce((s, c) => s + (c.amount || 0), 0);
  }

  this.totalAmount = total;

  let paid = 0;
  if (this.paidTransactions?.length) {
    paid = this.paidTransactions.reduce((s, t) => s + (t.amount || 0), 0);
  }

  this.paidAmount = paid;
  this.pendingAmount = this.totalAmount - paid;

  if (this.loanFacility?.isActive) {
    const loanAmount = this.loanFacility.loanAmount || 0;
    const extraFee = this.loanFacility.extraFee || 0;
    this.loanFacility.totalTakenAmount = loanAmount + extraFee;
  }
});

// ================= SOFT DELETE =================

LeadSchema.methods.softDelete = function () {
  this.deletedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model("Lead", LeadSchema);
