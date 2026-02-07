const mongoose = require("mongoose");

// Sub-schemas
const BuyerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  email: String,
  aadhar: String,
  pan: String
});

const SellerSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  email: String,
  aadhar: String,
  pan: String
});

const IndividualSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  address: String,
  email: String,
  aadhar: String,
  pan: String
});

const DocumentSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  uploadedAt: { type: Date, default: Date.now }
});

const OtherFeeSchema = new mongoose.Schema({
  description: String,
  amount: { type: Number, default: 0 },
  date: Date
});

const CommissionSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  date: Date,
  description: String
});

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  mode: { type: String, enum: ["cash", "cheque", "online", "card", "upi"] },
  date: { type: Date, default: Date.now },
  remark: String,
  reference: String
});

const PendingAmountSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  date: Date,
  remark: String
});

// Main Lead Schema
const LeadSchema = new mongoose.Schema({
  leadId: { type: String },
  
  // Step 1
  customerName: { type: String, required: [true, 'Customer name is required'] },
  mobileNumber: { type: String, required: [true, 'Mobile number is required'] },
  email: String,
  address: String,
  sourceOfEntry: { type: String, enum: ["direct", "reference"], default: "direct" },
  referenceName: String,
  declarationAmount: { type: Number, default: 0 },
  documentType: String,
  leadStatus: { type: String, default: "New" },
  date: { type: Date, required: [true, 'Date is required'] },
  
  // Step 2
  buyers: [BuyerSchema],
  sellers: [SellerSchema],
  individual: IndividualSchema,
  documentTypeOption: { type: String, enum: ["EM_0.50", "EM_0.25", "RM_1.8"] },
  ownerName: String,
  bankName: String,
  
  // Step 3
  propertyLocation: String,
  documentNumber: String,
  documentStartingDate: Date,
  documentStatus: String,
  leadDocuments: [DocumentSchema],
  
  // Step 4
  stampDuty: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  mutationFee: { type: Number, default: 0 },
  otherFees: [OtherFeeSchema],
  officeFee: { type: Number, default: 0 },
  registrarCommission: [CommissionSchema],
  agentCommission: [CommissionSchema],
  totalAmount: { type: Number, default: 0 },
  payments: [PaymentSchema],
  pendingAmount: PendingAmountSchema,
  
  // Step 5
  completionDate: Date,
  successStatus: { type: String, enum: ["yes", "no"] },
  remark: String,
  
  // System fields
  stepCompleted: { type: Number, default: 1 },
  isDraft: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: Date
});

// Pre-save middleware
LeadSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  // Generate leadId
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

  if (this.otherFees && this.otherFees.length > 0) {
    total += this.otherFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  }

  if (this.registrarCommission && this.registrarCommission.length > 0) {
    total += this.registrarCommission.reduce((sum, comm) => sum + (comm.amount || 0), 0);
  }
  if (this.agentCommission && this.agentCommission.length > 0) {
    total += this.agentCommission.reduce((sum, comm) => sum + (comm.amount || 0), 0);
  }

  this.totalAmount = total;

  // Calculate pending amount
  const totalPaid = this.payments ? this.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0) : 0;
  if (!this.pendingAmount) this.pendingAmount = {};
  this.pendingAmount.amount = this.totalAmount - totalPaid;
});

// Indexes
LeadSchema.index({ leadId: 1 }, { unique: true });
LeadSchema.index({ mobileNumber: 1 });
LeadSchema.index({ leadStatus: 1 });
LeadSchema.index({ stepCompleted: 1 });
LeadSchema.index({ createdAt: -1 });

// Soft delete method
LeadSchema.methods.softDelete = function () {
  this.deletedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model("Lead", LeadSchema);