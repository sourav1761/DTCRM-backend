// const mongoose = require("mongoose");

// const StampDutyPaymentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   documentType: { type: String, required: true },

//   stampDutyAmount: { type: Number, required: true },

//   estimatedReturn: { type: Number, required: true }, // ⭐ 1.5% of this entry

//   paidDate: { type: Date, required: true },

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("StampDutyPayment", StampDutyPaymentSchema);



const mongoose = require("mongoose");

const StampDutyPaymentSchema = new mongoose.Schema({
  amountPaid: { type: Number, required: true },
  returnAmount: { type: Number, required: true }, // 1.5%
  description: { type: String },
  paidDate: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StampDutyPayment", StampDutyPaymentSchema);
