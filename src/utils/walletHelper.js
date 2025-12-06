const WalletTransaction = require("../models/WalletTransaction");

// Deduct from wallet
exports.autoWalletDeduct = async (amount, leadId, description, isStampDuty = false) => {
  try {
    // Check current balance first
    const agg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    let deposits = 0, withdraws = 0, estimatedReturns = 0;
    agg.forEach((a) => {
      if (a._id === "deposit") deposits = a.total;
      if (a._id === "withdraw") withdraws = a.total;
      if (a._id === "estimated_return") estimatedReturns = a.total;
    });

    const balance = (deposits || 0) - (withdraws || 0) + (estimatedReturns || 0);

    if (amount > balance) {
      throw new Error(`Insufficient wallet balance. Available: ${balance}, Required: ${amount}`);
    }

    // Create withdrawal transaction
    const tx = await WalletTransaction.create({
      type: "withdraw",
      amount,
      method: "auto_deduct",
      reference: description || "Auto Deduct for Lead",
      lead: leadId,
      autoDeduct: true,
      isStampDuty: isStampDuty
    });

    // ⭐ MOST IMPORTANT: Add 1.5% estimated return ONLY for stamp duty deductions
    if (isStampDuty) {
      const estimatedReturnAmount = amount * 0.015; // 1.5%
      await WalletTransaction.create({
        type: "estimated_return",
        amount: estimatedReturnAmount,
        method: "estimated_return",
        reference: `1.5% Estimated Return on Stamp Duty: ${description}`,
        lead: leadId,
        estimatedReturnAdded: true,
        estimatedReturnAmount: estimatedReturnAmount
      });
    }

    return tx;
  } catch (err) {
    console.error("Wallet deduct error:", err.message);
    throw err;
  }
};

// Refund to wallet
exports.autoWalletRefund = async (amount, leadId, description, isStampDuty = false) => {
  try {
    // ⭐ IMPORTANT: When refunding stamp duty, also remove the estimated return
    if (isStampDuty) {
      // Find the corresponding estimated return transaction
      const estimatedTx = await WalletTransaction.findOne({
        lead: leadId,
        type: "estimated_return",
        estimatedReturnAdded: true,
        reference: { $regex: description, $options: "i" }
      }).sort({ createdAt: -1 });

      if (estimatedTx) {
        // Remove the estimated return by adding a negative transaction
        await WalletTransaction.create({
          type: "estimated_return",
          amount: -estimatedTx.amount,
          method: "estimated_return_reversal",
          reference: `Reversal: ${estimatedTx.reference}`,
          lead: leadId,
          estimatedReturnAdded: false
        });
      }
    }

    // Create deposit transaction (refund)
    const tx = await WalletTransaction.create({
      type: "deposit",
      amount,
      method: "auto_refund",
      reference: description || "Auto Refund for Lead",
      lead: leadId,
      autoRefund: true,
      isStampDuty: isStampDuty
    });

    return tx;
  } catch (err) {
    console.error("Wallet refund error:", err.message);
    throw err;
  }
};

// Get wallet balance with estimated returns
exports.getWalletBalance = async () => {
  try {
    const agg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    let deposits = 0, withdraws = 0, estimatedReturns = 0;
    agg.forEach((a) => {
      if (a._id === "deposit") deposits = a.total;
      if (a._id === "withdraw") withdraws = a.total;
      if (a._id === "estimated_return") estimatedReturns = a.total;
    });

    return {
      mainBalance: (deposits || 0) - (withdraws || 0),
      estimatedReturns: estimatedReturns || 0,
      totalBalance: (deposits || 0) - (withdraws || 0) + (estimatedReturns || 0)
    };
  } catch (err) {
    console.error("Get balance error:", err.message);
    throw err;
  }
};

// ⭐ NEW: Get estimated returns separately
exports.getEstimatedReturns = async () => {
  try {
    const agg = await WalletTransaction.aggregate([
      { $match: { type: "estimated_return" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    return agg.length > 0 ? agg[0].total : 0;
  } catch (err) {
    console.error("Get estimated returns error:", err.message);
    throw err;
  }
};