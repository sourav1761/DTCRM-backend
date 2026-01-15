// const mongoose = require("mongoose");

// const LoanSchema = new mongoose.Schema({
//   clientName: { type: String, required: true },
//   mobileNumber: { type: String, required: true },

//   aadharCard: { type: String, required: true },
//   panCard: { type: String, required: true },

//   loanType: { type: String, required: true },

//   loanAmount: { type: Number, required: true },
//   extraFee: { type: Number, default: 0 },

//   totalRecoverableAmount: { type: Number, required: true },

//   pendingAmount: { type: Number, required: true },
//   pendingAmountDate: { type: Date, required: true },

//   loanDate: { type: Date, required: true },

//   documents: [
//     {
//       fileName: String,
//       filePath: String,
//       fileType: String,
//     },
//   ],

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Loan", LoanSchema);
















const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  mobileNumber: { type: String, required: true },

  aadharCard: { type: String, required: true },
  panCard: { type: String, required: true },

  loanType: { type: String, required: true },

  loanAmount: { type: Number, required: true },
  extraFee: { type: Number, default: 0 },

  totalRecoverableAmount: { type: Number, required: true },

  pendingAmount: { type: Number, required: true },
  pendingAmountDate: { type: Date, required: true },

  loanDate: { type: Date, required: true },

  documents: [
    {
      fileName: String,
      filePath: String,
      fileType: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", LoanSchema);
