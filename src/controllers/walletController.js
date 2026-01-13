
// const WalletTransaction = require("../models/WalletTransaction");
// const Lead = require("../models/Lead");
// const { getWalletBalance, getEstimatedReturns } = require("../utils/walletHelper");

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

//     const balanceData = await getWalletBalance();
//     const availableBalance = balanceData.totalBalance;

//     if (amount > availableBalance)
//       return res.status(400).json({
//         success: false,
//         message: `Insufficient balance. Available: ${availableBalance}, Required: ${amount}`
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
//     const balanceData = await getWalletBalance();
//     const estimatedReturns = await getEstimatedReturns();

//     res.json({
//       success: true,
//       mainBalance: balanceData.mainBalance,
//       estimatedReturns: balanceData.estimatedReturns,
//       totalBalance: balanceData.totalBalance,
//       detailed: balanceData
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.getRecentTransactions = async (req, res) => {
//   try {
//     const { limit = 20 } = req.query;
//     const txs = await WalletTransaction.find()
//       .populate("lead", "customerName phone")
//       .sort({ createdAt: -1 })
//       .limit(Number(limit));

//     res.json({ success: true, txs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ⭐ NEW: Get transactions by type
// exports.getTransactionsByType = async (req, res) => {
//   try {
//     const { type } = req.params;
//     const txs = await WalletTransaction.find({ type })
//       .populate("lead", "customerName phone")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, txs });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // ⭐ Get all estimated return transactions
// exports.getEstimatedReturnTransactions = async (req, res) => {
//   try {
//     const txs = await WalletTransaction.find({ type: "estimated_return" })
//       .populate("lead", "customerName phone")
//       .sort({ createdAt: -1 });

//     const total = txs.reduce((sum, t) => sum + Number(t.amount || 0), 0);

//     res.json({
//       success: true,
//       totalEstimatedReturn: total,
//       count: txs.length,
//       transactions: txs
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// const WalletTransaction = require("../models/WalletTransaction");
// const StampDutyPayment = require("../models/StampDutyPayment");
// const { getWalletBalance } = require("../utils/walletHelper");

// // ==========================
// // BALANCE (2 BLOCKS)
// // ==========================
// exports.getBalance = async (req, res) => {
//   try {
//     const wallet = await getWalletBalance();

//     const agg = await StampDutyPayment.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalStampDuty: { $sum: "$stampDutyAmount" },
//           totalReturn: { $sum: "$estimatedReturn" },
//         },
//       },
//     ]);

//     const data = agg[0] || { totalStampDuty: 0, totalReturn: 0 };

//     res.json({
//       success: true,

//       block1: {
//         currentBalance: wallet.currentBalance,
//       },

//       block2: {
//         stampDutyPaid: data.totalStampDuty,
//         estimatedReturn: data.totalReturn,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ==========================
// // ADD STAMP DUTY PAYMENT
// // ==========================
// exports.addStampDutyPayment = async (req, res) => {
//   try {
//     const { name, documentType, stampDutyAmount, paidDate } = req.body;

//     if (!name || !documentType || !stampDutyAmount || !paidDate) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing fields" });
//     }

//     const estimatedReturn = stampDutyAmount * 0.015; // ⭐ ONLY THIS ENTRY

//     const payment = await StampDutyPayment.create({
//       name,
//       documentType,
//       stampDutyAmount,
//       estimatedReturn,
//       paidDate,
//     });

//     res.status(201).json({
//       success: true,
//       payment,
//       estimatedReturn,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ==========================
// // LIST STAMP DUTY PAYMENTS
// // ==========================
// exports.getStampDutyPayments = async (req, res) => {
//   try {
//     const list = await StampDutyPayment.find().sort({ createdAt: -1 });
//     res.json({ success: true, list });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




















const WalletTransaction = require("../models/WalletTransaction");
const StampDutyPayment = require("../models/StampDutyPayment");
const { getWalletBalance } = require("../utils/walletHelper");

// ==========================
// DEPOSIT
// ==========================
exports.addDeposit = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const tx = await WalletTransaction.create({
      type: "deposit",
      amount,
      method,
      reference,
    });

    res.status(201).json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// WITHDRAW
// ==========================
exports.addWithdraw = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const wallet = await getWalletBalance();

    if (amount > wallet.currentBalance) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance. Available: ${wallet.currentBalance}`,
      });
    }

    const tx = await WalletTransaction.create({
      type: "withdraw",
      amount,
      method,
      reference,
    });

    res.status(201).json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// BALANCE (2 BLOCKS)
// ==========================
exports.getBalance = async (req, res) => {
  try {
    const wallet = await getWalletBalance();

    const agg = await StampDutyPayment.aggregate([
      {
        $group: {
          _id: null,
          totalStampDuty: { $sum: "$stampDutyAmount" },
          totalReturn: { $sum: "$estimatedReturn" },
        },
      },
    ]);

    const data = agg[0] || { totalStampDuty: 0, totalReturn: 0 };

    res.json({
      success: true,
      block1: {
        currentBalance: wallet.currentBalance,
      },
      block2: {
        stampDutyPaid: data.totalStampDuty,
        estimatedReturn: data.totalReturn,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// RECENT TRANSACTIONS
// ==========================
exports.getRecentTransactions = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const txs = await WalletTransaction.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, txs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// ADD STAMP DUTY PAYMENT
// ==========================
exports.addStampDutyPayment = async (req, res) => {
  try {
    const { name, documentType, stampDutyAmount, paidDate } = req.body;

    if (!name || !documentType || !stampDutyAmount || !paidDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const estimatedReturn = stampDutyAmount * 0.015;

    const payment = await StampDutyPayment.create({
      name,
      documentType,
      stampDutyAmount,
      estimatedReturn,
      paidDate,
    });

    res.status(201).json({
      success: true,
      payment,
      estimatedReturn,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// LIST STAMP DUTY PAYMENTS
// ==========================
exports.getStampDutyPayments = async (req, res) => {
  try {
    const list = await StampDutyPayment.find().sort({ createdAt: -1 });
    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
