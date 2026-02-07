const mongoose = require("mongoose");

const SampadaWalletSchema = new mongoose.Schema({
  currentAccountBalance: { type: Number, default: 0 },
  registrationFee: { type: Number, default: 0 },
  stampDutyFee: { type: Number, default: 0 },
  mutationFee: { type: Number, default: 0 },

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SampadaWallet", SampadaWalletSchema);
