
const WalletTransaction = require("../models/WalletTransaction");
const Lead = require("../models/Lead");
const { getWalletBalance, getEstimatedReturns } = require("../utils/walletHelper");

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

    const balanceData = await getWalletBalance();
    const availableBalance = balanceData.totalBalance;

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

// get balance
exports.getBalance = async (req, res) => {
  try {
    const balanceData = await getWalletBalance();
    const estimatedReturns = await getEstimatedReturns();

    res.json({
      success: true,
      mainBalance: balanceData.mainBalance,
      estimatedReturns: balanceData.estimatedReturns,
      totalBalance: balanceData.totalBalance,
      detailed: balanceData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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

// ⭐ NEW: Get transactions by type
exports.getTransactionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const txs = await WalletTransaction.find({ type })
      .populate("lead", "customerName phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, txs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ⭐ Get all estimated return transactions
exports.getEstimatedReturnTransactions = async (req, res) => {
  try {
    const txs = await WalletTransaction.find({ type: "estimated_return" })
      .populate("lead", "customerName phone")
      .sort({ createdAt: -1 });

    const total = txs.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    res.json({
      success: true,
      totalEstimatedReturn: total,
      count: txs.length,
      transactions: txs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
