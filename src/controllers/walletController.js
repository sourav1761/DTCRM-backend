// const WalletTransaction = require("../models/WalletTransaction");
// const Lead = require("../models/Lead");

// // deposit
// exports.addDeposit = async (req, res) => {
//   try {
//     const { amount, method, reference, leadId } = req.body;
//     if (!amount || amount <= 0)
//       return res.status(400).json({ success: false, message: "Invalid amount" });

//     const tx = await WalletTransaction.create({
//       type: "deposit",
//       amount,
//       method,
//       reference,
//       lead: leadId
//     });

//     res.status(201).json({ success: true, tx });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // withdraw
// exports.addWithdraw = async (req, res) => {
//   try {
//     const { amount, method, reference, leadId } = req.body;
//     if (!amount || amount <= 0)
//       return res.status(400).json({ success: false, message: "Invalid amount" });

//     const agg = await WalletTransaction.aggregate([
//       { $group: { _id: "$type", total: { $sum: "$amount" } } }
//     ]);

//     let deposits = 0,
//       withdraws = 0;

//     agg.forEach((a) => {
//       if (a._id === "deposit") deposits = a.total;
//       if (a._id === "withdraw") withdraws = a.total;
//     });

//     const balance = (deposits || 0) - (withdraws || 0);

//     if (amount > balance)
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient balance"
//       });

//     const tx = await WalletTransaction.create({
//       type: "withdraw",
//       amount,
//       method,
//       reference,
//       lead: leadId
//     });

//     res.status(201).json({ success: true, tx });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // get balance
// exports.getBalance = async (req, res) => {
//   try {
//     const agg = await WalletTransaction.aggregate([
//       { $group: { _id: "$type", total: { $sum: "$amount" } } }
//     ]);

//     let deposits = 0,
//       withdraws = 0;

//     agg.forEach((a) => {
//       if (a._id === "deposit") deposits = a.total;
//       if (a._id === "withdraw") withdraws = a.total;
//     });

//     res.json({
//       success: true,
//       balance: (deposits || 0) - (withdraws || 0),
//       deposits,
//       withdraws
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getRecentTransactions = async (req, res) => {
//   try {
//     const { limit = 20 } = req.query;
//     const txs = await WalletTransaction.find()
//       .sort({ createdAt: -1 })
//       .limit(Number(limit));

//     res.json({ success: true, txs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };








const WalletTransaction = require("../models/WalletTransaction");
const Lead = require("../models/Lead");

// deposit
exports.addDeposit = async (req, res) => {
  try {
    const { amount, method, reference, leadId } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: "Invalid amount" });

    const tx = await WalletTransaction.create({
      type: "deposit",
      amount,
      method,
      reference,
      lead: leadId
    });

    res.status(201).json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// withdraw
exports.addWithdraw = async (req, res) => {
  try {
    const { amount, method, reference, leadId } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: "Invalid amount" });

    // Get wallet balance with estimated returns
    const agg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    let deposits = 0, withdraws = 0, estimatedReturns = 0;
    agg.forEach((a) => {
      if (a._id === "deposit") deposits = a.total;
      if (a._id === "withdraw") withdraws = a.total;
      if (a._id === "estimated_return") estimatedReturns = a.total;
    });

    // Include estimated returns in available balance
    const availableBalance = (deposits || 0) + (estimatedReturns || 0) - (withdraws || 0);

    if (amount > availableBalance)
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${availableBalance}, Required: ${amount}`
      });

    const tx = await WalletTransaction.create({
      type: "withdraw",
      amount,
      method,
      reference,
      lead: leadId
    });

    res.status(201).json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// get balance (Updated to show estimated returns)
exports.getBalance = async (req, res) => {
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

    const availableBalance = (deposits || 0) + (estimatedReturns || 0) - (withdraws || 0);

    res.json({
      success: true,
      balance: availableBalance,
      deposits: deposits || 0,
      withdraws: withdraws || 0,
      estimatedReturns: estimatedReturns || 0,
      availableBalance: availableBalance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get recent transactions
exports.getRecentTransactions = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const txs = await WalletTransaction.find()
      .populate("lead", "customerName phone")
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, txs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ⭐ NEW: Get wallet summary with estimated returns breakdown
exports.getWalletSummary = async (req, res) => {
  try {
    // Get all transactions
    const txs = await WalletTransaction.find().populate("lead", "customerName");
    
    // Calculate totals by type
    const summary = txs.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + tx.amount;
      return acc;
    }, {});

    // Get all leads to calculate total stamp duty
    const leads = await Lead.find();
    const totalStampDuty = leads.reduce((sum, lead) => {
      const stampTotal = lead.stampDutyTransactions.reduce(
        (s, t) => s + Number(t.amount || 0), 0
      );
      return sum + stampTotal;
    }, 0);

    // Calculate expected returns (1.5% of total stamp duty)
    const expectedReturns = totalStampDuty * 0.015;

    res.json({
      success: true,
      summary: {
        deposits: summary.deposit || 0,
        withdraws: summary.withdraw || 0,
        estimatedReturns: summary.estimated_return || 0,
        availableBalance: (summary.deposit || 0) + (summary.estimated_return || 0) - (summary.withdraw || 0)
      },
      stampDutyAnalysis: {
        totalStampDutyCollected: totalStampDuty,
        expectedReturnsRate: "1.5%",
        expectedReturnsAmount: expectedReturns,
        actualReturnsAdded: summary.estimated_return || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};