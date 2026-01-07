
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

// Transaction schema for commissions
const CommissionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  mode: { 
    type: String, 
    enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"],
    required: true 
  },
  remarks: { type: String }
});

// Other fee schema
const OtherFeeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true }
});

// Payment transaction schema
const PaymentTransactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  mode: { 
    type: String, 
    enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"],
    required: true 
  },
  purpose: { type: String },
  remarks: { type: String }
});

// Document upload schema
const DocumentUploadSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Loan facility schema
const LoanFacilitySchema = new mongoose.Schema({
  isActive: { type: Boolean, default: false },
  clientName: { type: String },
  aadharNumber: { type: String },
  phoneNumber: { type: String },
  documentUploads: [DocumentUploadSchema],
  loanAmount: { type: Number },
  extraFee: { type: Number },
  loanDate: { type: Date },
  totalTakenAmount: { type: Number }, // loanAmount + extraFee
  givenOrPendingDate: { type: Date }
});

// Buyer/Seller schema
const PartySchema = new mongoose.Schema({
  name: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  email: { type: String },
  aadhar: { type: String },
  pan: { type: String }
});

// Main Lead Schema
const LeadSchema = new mongoose.Schema({
  // Step 1: Basic Information
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String },
  address: { type: String },
  reference: { 
    type: String, 
    enum: ["direct", "agent"],
    default: "direct"
  },
  agentName: { type: String }, // Only if reference is "agent"
  firstAmount: { type: Number }, // Declared first meeting amount (not included in calculations)
  documentType: { 
    type: String,
    enum: [
      "Sale Deed (SD + R)",
      "Gift Deed (SD + R)",
      "Release Deed (SD + R)",
      "Co-ownership Deed (SD + R)",
      "Consent Deed (SD + R)",
      "Lease Deed (SD + R)",
      "Power of Attorney (SD + R)",
      "Will Deed (R)",
      "EM (0.50%) (SD + R)",
      "EC (0.25%) (SD + R)",
      "RM (1.8%) (SD + R)",
      "Rent Agreement (SD + R)",
      "Sale Agreement (SD + R)",
      "Other (SD)",
      "E-Stamp (SD)",
      "Certified Copy (R)"
    ]
  },
  leadDate: { type: Date, required: true },
  stepCompleted: { type: Number, default: 1 }, // Track current step (1-5)
  
  // Step 1.1: Loan/Credit Facility (Optional)
  loanFacility: { type: LoanFacilitySchema, default: null },
  
  // Step 2: Party Details
  partyType: { 
    type: String, 
    enum: ["buyer", "seller", "individual", "both"],
    default: "individual"
  },
  buyer: { type: PartySchema },
  seller: { type: PartySchema },
  individual: { type: PartySchema },
  
  // Step 3: Document Details
  propertyLocation: { type: String },
  documentNumber: { type: String },
  documentStartingDate: { type: Date },
  documentStatus: { 
    type: String, 
    enum: ["Draft", "Signed", "Submitted", "Registration Pending", "Registration Completed"],
    default: "Draft"
  },
  documentUploads: [DocumentUploadSchema],
  
  // Step 4: Payment Details
  stampDuty: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  mutationFee: { type: Number, default: 0 },
  otherFees: [OtherFeeSchema], // Array of other fees with description
  officeFee: { type: Number, default: 0 },
  registrarCommission: [CommissionSchema], // Array of commission transactions
  agentCommission: [CommissionSchema], // Array of commission transactions
  paidTransactions: [PaymentTransactionSchema],
  pendingTransactions: [PaymentTransactionSchema],
  
  // Calculated amounts
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },
  
  // Step 5: Completion Details
  completionDate: { type: Date },
  successStatus: { 
    type: String, 
    enum: ["Successful", "Unsuccessful", "Pending"],
    default: "Pending"
  },
  finalRemarks: { type: String },
  
  // Lead Status
  leadStatus: { 
    type: String, 
    enum: ["New", "In Progress", "signed", "pending by our side", "pending by registrar", "pending by client", "completed"],
    default: "New"
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date } // Soft delete
});

// Auto update timestamp
LeadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  
  // Calculate total amount before saving
  if (this.isModified('stampDuty') || this.isModified('registrationFee') || 
      this.isModified('mutationFee') || this.isModified('officeFee') ||
      this.isModified('otherFees') || this.isModified('registrarCommission') ||
      this.isModified('agentCommission')) {
    
    let total = 0;
    
    // Add basic fees
    total += this.stampDuty || 0;
    total += this.registrationFee || 0;
    total += this.mutationFee || 0;
    total += this.officeFee || 0;
    
    // Add other fees
    if (this.otherFees && this.otherFees.length > 0) {
      total += this.otherFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    }
    
    // Add registrar commissions
    if (this.registrarCommission && this.registrarCommission.length > 0) {
      total += this.registrarCommission.reduce((sum, comm) => sum + (comm.amount || 0), 0);
    }
    
    // Add agent commissions
    if (this.agentCommission && this.agentCommission.length > 0) {
      total += this.agentCommission.reduce((sum, comm) => sum + (comm.amount || 0), 0);
    }
    
    this.totalAmount = total;
    
    // Calculate pending amount
    let paid = 0;
    if (this.paidTransactions && this.paidTransactions.length > 0) {
      paid = this.paidTransactions.reduce((sum, trans) => sum + (trans.amount || 0), 0);
    }
    this.paidAmount = paid;
    this.pendingAmount = this.totalAmount - paid;
  }
  
  // Calculate loan total amount
  if (this.loanFacility && this.loanFacility.isActive) {
    const loanAmount = this.loanFacility.loanAmount || 0;
    const extraFee = this.loanFacility.extraFee || 0;
    this.loanFacility.totalTakenAmount = loanAmount + extraFee;
  }
  
  next();
});

// Soft delete method
LeadSchema.methods.softDelete = function() {
  this.deletedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model("Lead", LeadSchema);