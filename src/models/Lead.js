
// const mongoose = require("mongoose");

// // ================= SCHEMAS =================

// const CommissionSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   amount: { type: Number, required: true },
//   mode: { type: String, enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"], required: true },
//   remarks: { type: String }
// });

// const OtherFeeSchema = new mongoose.Schema({
//   description: { type: String, required: true },
//   amount: { type: Number, required: true }
// });

// const PaymentTransactionSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   amount: { type: Number, required: true },
//   mode: { type: String, enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"], required: true },
//   purpose: { type: String },
//   remarks: { type: String }
// });

// const DocumentUploadSchema = new mongoose.Schema({
//   fileName: { type: String, required: true },
//   filePath: { type: String, required: true },
//   uploadedAt: { type: Date, default: Date.now }
// });

// const LoanFacilitySchema = new mongoose.Schema({
//   isActive: { type: Boolean, default: false },
//   clientName: String,
//   aadharNumber: String,
//   phoneNumber: String,
//   documentUploads: [DocumentUploadSchema],
//   loanAmount: Number,
//   extraFee: Number,
//   loanDate: Date,
//   totalTakenAmount: Number,
//   givenOrPendingDate: Date
// });

// const PartySchema = new mongoose.Schema({
//   name: String,
//   phoneNumber: String,
//   address: String,
//   email: String,
//   aadhar: String,
//   pan: String
// });

// // ================= MAIN SCHEMA =================

// const LeadSchema = new mongoose.Schema({
//   customerName: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
//   email: String,
//   address: String,
//   reference: { type: String, enum: ["direct", "agent"], default: "direct" },
//   agentName: String,
//   firstAmount: Number,
//   documentType: String,
//   leadDate: { type: Date, required: true },
//   stepCompleted: { type: Number, default: 1 },

//   loanFacility: { type: LoanFacilitySchema, default: null },

//   partyType: { type: String, enum: ["buyer", "seller", "individual", "both"], default: "individual" },
//   buyer: PartySchema,
//   seller: PartySchema,
//   individual: PartySchema,

//   propertyLocation: String,
//   documentNumber: String,
//   documentStartingDate: Date,
//   documentStatus: { type: String, default: "Draft" },
//   documentUploads: [DocumentUploadSchema],

//   stampDuty: { type: Number, default: 0 },
//   registrationFee: { type: Number, default: 0 },
//   mutationFee: { type: Number, default: 0 },
//   otherFees: [OtherFeeSchema],
//   officeFee: { type: Number, default: 0 },
//   registrarCommission: [CommissionSchema],
//   agentCommission: [CommissionSchema],
//   paidTransactions: [PaymentTransactionSchema],
//   pendingTransactions: [PaymentTransactionSchema],

//   totalAmount: { type: Number, default: 0 },
//   paidAmount: { type: Number, default: 0 },
//   pendingAmount: { type: Number, default: 0 },

//   completionDate: Date,
//   successStatus: { type: String, default: "Pending" },
//   finalRemarks: String,

//   leadStatus: { type: String, default: "New" },

//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   deletedAt: Date
// });

// // ================= PRE SAVE (NO next) =================

// LeadSchema.pre("save", async function () {
//   this.updatedAt = Date.now();

//   let total = 0;
//   total += this.stampDuty || 0;
//   total += this.registrationFee || 0;
//   total += this.mutationFee || 0;
//   total += this.officeFee || 0;

//   if (this.otherFees?.length) {
//     total += this.otherFees.reduce((s, f) => s + (f.amount || 0), 0);
//   }
//   if (this.registrarCommission?.length) {
//     total += this.registrarCommission.reduce((s, c) => s + (c.amount || 0), 0);
//   }
//   if (this.agentCommission?.length) {
//     total += this.agentCommission.reduce((s, c) => s + (c.amount || 0), 0);
//   }

//   this.totalAmount = total;

//   let paid = 0;
//   if (this.paidTransactions?.length) {
//     paid = this.paidTransactions.reduce((s, t) => s + (t.amount || 0), 0);
//   }

//   this.paidAmount = paid;
//   this.pendingAmount = this.totalAmount - paid;

//   if (this.loanFacility?.isActive) {
//     const loanAmount = this.loanFacility.loanAmount || 0;
//     const extraFee = this.loanFacility.extraFee || 0;
//     this.loanFacility.totalTakenAmount = loanAmount + extraFee;
//   }
// });

// // ================= SOFT DELETE =================

// LeadSchema.methods.softDelete = function () {
//   this.deletedAt = Date.now();
//   return this.save();
// };

// module.exports = mongoose.model("Lead", LeadSchema);





const mongoose = require("mongoose");

// ================= SCHEMAS =================

const CommissionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  mode: { type: String, enum: ["Cash", "Cheque", "UPI", "Bank Transfer", "Online"], required: true },
  remarks: { type: String },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" }
});

const OtherFeeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" }
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
  uploadedAt: { type: Date, default: Date.now },
  documentType: { type: String }
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
  // Step 1 Fields
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: String,
  address: String,
  reference: { type: String, enum: ["direct", "associate"], default: "direct" },
  agentName: String,
  declarationAmount: Number,
  documentType: String,
  leadDate: { type: Date, required: true },
  stepCompleted: { type: Number, default: 1 },
  isDraft: { type: Boolean, default: false },

  // Loan Facility (Optional)
  loanFacility: { type: LoanFacilitySchema, default: null },

  // Step 2 Fields
  partyType: { type: String, enum: ["buyer", "seller", "individual", "both"], default: "individual" },
  buyer: PartySchema,
  seller: PartySchema,
  individual: PartySchema,
  ownerName: String,
  bankName: String,

  // Step 3 Fields
  propertyLocation: String,
  documentNumber: String,
  documentStartingDate: Date,
  documentStatus: { type: String, default: "Draft" },
  documentUploads: [DocumentUploadSchema],

  // Step 4 Fields
  stampDuty: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  mutationFee: { type: Number, default: 0 },
  officeFee: { type: Number, default: 0 },
  otherFees: [OtherFeeSchema],
  registrarCommission: [CommissionSchema],
  agentCommission: [CommissionSchema],
  paidTransactions: [PaymentTransactionSchema],
  pendingTransactions: [PaymentTransactionSchema],
  
  // Manual totals from Step 4
  manualTotalAmount: { type: Number, default: 0 },
  manualPaidAmount: { type: Number, default: 0 },
  manualPaidDate: Date,
  manualPaymentMode: String,
  manualPaymentRemark: String,
  manualPendingAmount: { type: Number, default: 0 },
  manualPendingDate: Date,
  manualPendingRemark: String,

  // Auto-calculated totals
  totalAmount: { type: Number, default: 0 },
  paidAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },

  // Step 5 Fields
  completionDate: Date,
  successStatus: { type: String, enum: ["yes", "no", "pending"], default: "pending" },
  finalRemarks: String,

  // Lead tracking
  leadStatus: { type: String, default: "New" },
  leadId: { type: String, unique: true }, // Custom lead ID for easy reference

  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date
});

// ================= PRE SAVE (Generate Lead ID) =================

LeadSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();

  // Generate custom lead ID if not exists
  if (!this.leadId) {
    const year = new Date().getFullYear();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const count = await mongoose.model('Lead').countDocuments({
      createdAt: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`)
      }
    });
    this.leadId = `LD${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }

  // Calculate total amount
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

  // Calculate paid amount
  let paid = 0;
  if (this.paidTransactions?.length) {
    paid = this.paidTransactions.reduce((s, t) => s + (t.amount || 0), 0);
  }

  this.paidAmount = paid;
  this.pendingAmount = this.totalAmount - paid;

  // Calculate loan total if active
  if (this.loanFacility?.isActive) {
    const loanAmount = this.loanFacility.loanAmount || 0;
    const extraFee = this.loanFacility.extraFee || 0;
    this.loanFacility.totalTakenAmount = loanAmount + extraFee;
  }

  next();
});

// ================= INDEXES =================

LeadSchema.index({ leadId: 1 });
LeadSchema.index({ mobileNumber: 1 });
LeadSchema.index({ leadStatus: 1 });
LeadSchema.index({ stepCompleted: 1 });
LeadSchema.index({ createdAt: -1 });

// ================= SOFT DELETE =================

LeadSchema.methods.softDelete = function () {
  this.deletedAt = Date.now();
  return this.save();
};

// ================= VIRTUAL METHODS =================

LeadSchema.virtual('fullAddress').get(function() {
  return `${this.address || ''}`.trim();
});

LeadSchema.virtual('daysOpen').get(function() {
  if (!this.createdAt) return 0;
  const diffTime = Math.abs(Date.now() - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model("Lead", LeadSchema);