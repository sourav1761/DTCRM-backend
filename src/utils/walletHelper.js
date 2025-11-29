const WalletTransaction = require("../models/WalletTransaction");

// Deduct amount from wallet automatically
exports.autoWalletDeduct = async (amount, leadId, reason = "Lead Auto Deduction") => {
  if (!amount || amount <= 0) return;

  await WalletTransaction.create({
    type: "withdraw",
    amount,
    method: "AUTO",
    reference: reason,
    lead: leadId
  });
};
