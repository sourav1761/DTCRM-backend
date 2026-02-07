
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
const SampadaWallet = require("../models/SampadaWallet");
const StampDutyPayment = require("../models/StampDutyPayment");

// ==========================
// HELPER — ENSURE SAMPADA WALLET EXISTS
// ==========================
const getSampadaWallet = async () => {
  let wallet = await SampadaWallet.findOne();
  if (!wallet) {
    wallet = await SampadaWallet.create({
      currentAccountBalance: 0,
      registrationFee: 0,
      stampDutyFee: 0,
      mutationFee: 0,
    });
  } else if (wallet.currentAccountBalance === undefined) {
    wallet.currentAccountBalance = 0;
    await wallet.save();
  }
  return wallet;
};

// ==========================
// CURRENT ACCOUNT – DEPOSIT
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

    const wallet = await getSampadaWallet();
    wallet.currentAccountBalance += Number(amount);
    await wallet.save();

    res.json({ success: true, tx, currentAccountBalance: wallet.currentAccountBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// CURRENT ACCOUNT – WITHDRAW
// ==========================
exports.addWithdraw = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;

    const wallet = await getSampadaWallet();

    if (amount > wallet.currentAccountBalance) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    const tx = await WalletTransaction.create({
      type: "withdraw",
      amount,
      method,
      reference,
    });

    wallet.currentAccountBalance -= Number(amount);
    await wallet.save();

    res.json({ success: true, tx, currentAccountBalance: wallet.currentAccountBalance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// ADD AMOUNT TO SAMPADA WALLET
// ==========================
exports.addSampadaAmount = async (req, res) => {
  try {
    const { registrationFee = 0, stampDutyFee = 0, mutationFee = 0 } = req.body;

    const wallet = await getSampadaWallet();
    console.log("Before update:", { currentAccountBalance: wallet.currentAccountBalance, registrationFee: wallet.registrationFee, stampDutyFee: wallet.stampDutyFee, mutationFee: wallet.mutationFee });

    const totalExpense = Number(registrationFee) + Number(stampDutyFee) + Number(mutationFee);
    console.log("Total expense to deduct:", totalExpense);

    if (totalExpense > wallet.currentAccountBalance) {
      return res.status(400).json({ success: false, message: "Insufficient current account balance" });
    }

    wallet.registrationFee += Number(registrationFee);
    wallet.stampDutyFee += Number(stampDutyFee);
    wallet.mutationFee += Number(mutationFee);
    wallet.currentAccountBalance -= totalExpense;

    wallet.updatedAt = new Date();
    await wallet.save();
    
    console.log("After update:", { currentAccountBalance: wallet.currentAccountBalance, registrationFee: wallet.registrationFee, stampDutyFee: wallet.stampDutyFee, mutationFee: wallet.mutationFee });

    res.json({ 
      success: true, 
      wallet,
      currentAccountBalance: wallet.currentAccountBalance,
      message: "Sampada wallet updated successfully"
    });
  } catch (err) {
    console.error("Error in addSampadaAmount:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// PAY STAMP DUTY TO GOVERNMENT (1.5% RETURN)
// ==========================
exports.payStampDuty = async (req, res) => {
  try {
    const { amount, description, paidDate } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const wallet = await getSampadaWallet();

    if (wallet.stampDutyFee < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient stamp duty balance" });
    }

    const returnAmount = Number((amount * 0.015).toFixed(2));

    wallet.stampDutyFee = wallet.stampDutyFee - amount + returnAmount;
    await wallet.save();

    const payment = await StampDutyPayment.create({
      amountPaid: amount,
      returnAmount,
      description,
      paidDate,
    });

    res.json({
      success: true,
      payment,
      returnAmount,
      updatedStampDutyBalance: wallet.stampDutyFee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// GET BALANCE
// ==========================
exports.getBalance = async (req, res) => {
  try {
    const wallet = await getSampadaWallet();
    console.log("Current wallet state:", wallet);

    res.json({
      success: true,
      currentAccountBalance: wallet.currentAccountBalance || 0,
      sampadaWallet: {
        registrationFee: wallet.registrationFee || 0,
        stampDutyFee: wallet.stampDutyFee || 0,
        mutationFee: wallet.mutationFee || 0,
        total:
          (wallet.registrationFee || 0) +
          (wallet.stampDutyFee || 0) +
          (wallet.mutationFee || 0),
      },
    });
  } catch (err) {
    console.error("Error in getBalance:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// SYNC WALLET (Initialize currentAccountBalance from deposits)
// ==========================
exports.syncWallet = async (req, res) => {
  try {
    const wallet = await getSampadaWallet();
    
    const agg = await WalletTransaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let deposit = 0;
    let withdraw = 0;

    agg.forEach((a) => {
      if (a._id === "deposit") deposit = a.total;
      if (a._id === "withdraw") withdraw = a.total;
    });

    wallet.currentAccountBalance = deposit - withdraw - wallet.registrationFee - wallet.stampDutyFee - wallet.mutationFee;
    await wallet.save();

    res.json({
      success: true,
      message: "Wallet synced successfully",
      wallet
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// STAMP DUTY HISTORY
// ==========================
exports.getStampDutyHistory = async (req, res) => {
  const list = await StampDutyPayment.find().sort({ createdAt: -1 });
  res.json({ success: true, list });
};

// ==========================
// GET DEPOSIT HISTORY
// ==========================
exports.getDepositHistory = async (req, res) => {
  try {
    const deposits = await WalletTransaction.find({ type: "deposit" }).sort({ createdAt: -1 });
    res.json({ success: true, transactions: deposits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// GET WITHDRAWAL HISTORY
// ==========================
exports.getWithdrawalHistory = async (req, res) => {
  try {
    const withdrawals = await WalletTransaction.find({ type: "withdraw" }).sort({ createdAt: -1 });
    res.json({ success: true, transactions: withdrawals });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================
// GET ALL TRANSACTIONS
// ==========================
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await WalletTransaction.find().sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
