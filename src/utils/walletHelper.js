// const WalletTransaction = require("../models/WalletTransaction");

// // Deduct from wallet
// exports.autoWalletDeduct = async (amount, leadId, description) => {
//   try {
//     // Check current balance first
//     const agg = await WalletTransaction.aggregate([
//       { $group: { _id: "$type", total: { $sum: "$amount" } } }
//     ]);

//     let deposits = 0, withdraws = 0;
//     agg.forEach((a) => {
//       if (a._id === "deposit") deposits = a.total;
//       if (a._id === "withdraw") withdraws = a.total;
//     });

//     const balance = (deposits || 0) - (withdraws || 0);

//     if (amount > balance) {
//       throw new Error(`Insufficient wallet balance. Available: ${balance}, Required: ${amount}`);
//     }

//     // Create withdrawal transaction
//     const tx = await WalletTransaction.create({
//       type: "withdraw",
//       amount,
//       method: "auto_deduct",
//       reference: description || "Auto Deduct for Lead",
//       lead: leadId,
//       autoDeduct: true
//     });

//     return tx;
//   } catch (err) {
//     console.error("Wallet deduct error:", err.message);
//     throw err;
//   }
// };

// // Refund to wallet
// exports.autoWalletRefund = async (amount, leadId, description) => {
//   try {
//     // Create deposit transaction (refund)
//     const tx = await WalletTransaction.create({
//       type: "deposit",
//       amount,
//       method: "auto_refund",
//       reference: description || "Auto Refund for Lead",
//       lead: leadId,
//       autoRefund: true
//     });

//     return tx;
//   } catch (err) {
//     console.error("Wallet refund error:", err.message);
//     throw err;
//   }
// };

// // Get wallet balance
// exports.getWalletBalance = async () => {
//   try {
//     const agg = await WalletTransaction.aggregate([
//       { $group: { _id: "$type", total: { $sum: "$amount" } } }
//     ]);

//     let deposits = 0, withdraws = 0;
//     agg.forEach((a) => {
//       if (a._id === "deposit") deposits = a.total;
//       if (a._id === "withdraw") withdraws = a.total;
//     });

//     return (deposits || 0) - (withdraws || 0);
//   } catch (err) {
//     console.error("Get balance error:", err.message);
//     throw err;
//   }
// };


const WalletTransaction = require("../models/WalletTransaction");

// Deduct from wallet
exports.autoWalletDeduct = async (amount, leadId, description) => {
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

    // Include estimated returns in balance calculation
    const balance = (deposits || 0) + (estimatedReturns || 0) - (withdraws || 0);

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
      autoDeduct: true
    });

    return tx;
  } catch (err) {
    console.error("Wallet deduct error:", err.message);
    throw err;
  }
};

// Refund to wallet
exports.autoWalletRefund = async (amount, leadId, description) => {
  try {
    // Create deposit transaction (refund)
    const tx = await WalletTransaction.create({
      type: "deposit",
      amount,
      method: "auto_refund",
      reference: description || "Auto Refund for Lead",
      lead: leadId,
      autoRefund: true
    });

    return tx;
  } catch (err) {
    console.error("Wallet refund error:", err.message);
    throw err;
  }
};

// ⭐ NEW: Add estimated returns to wallet (1.5% of stamp duty)
exports.addEstimatedReturns = async (amount, leadId, description) => {
  try {
    // Create estimated returns transaction
    const tx = await WalletTransaction.create({
      type: "estimated_return",
      amount,
      method: "stamp_duty_return",
      reference: description || "1.5% Returns from Stamp Duty",
      lead: leadId
    });

    return tx;
  } catch (err) {
    console.error("Add estimated returns error:", err.message);
    throw err;
  }
};

// Get wallet balance (Updated to include estimated returns)
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
      balance: (deposits || 0) + (estimatedReturns || 0) - (withdraws || 0),
      deposits: deposits || 0,
      withdraws: withdraws || 0,
      estimatedReturns: estimatedReturns || 0,
      availableBalance: (deposits || 0) + (estimatedReturns || 0) - (withdraws || 0)
    };
  } catch (err) {
    console.error("Get balance error:", err.message);
    throw err;
  }
};