const WalletTransaction = require("../models/WalletTransaction");
const Lead = require("../models/Lead");

// deposit
exports.addDeposit = async (req, res) => {
  try {
    const { amount, method, reference, leadId } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success:false, message: "Invalid amount" });
    const tx = await WalletTransaction.create({ type: "deposit", amount, method, reference, lead: leadId });
    res.status(201).json({ success:true, tx });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

// withdraw
exports.addWithdraw = async (req, res) => {
  try {
    const { amount, method, reference, leadId } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success:false, message: "Invalid amount" });

    // compute balance
    const agg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);
    let deposits = 0, withdraws = 0;
    agg.forEach(a => { if (a._id === "deposit") deposits = a.total; if (a._id === "withdraw") withdraws = a.total; });
    const balance = (deposits || 0) - (withdraws || 0);
    if (amount > balance) return res.status(400).json({ success:false, message: "Insufficient balance" });

    const tx = await WalletTransaction.create({ type: "withdraw", amount, method, reference, lead: leadId });
    res.status(201).json({ success:true, tx });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

// get balance
exports.getBalance = async (req, res) => {
  try {
    const agg = await WalletTransaction.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);
    let deposits = 0, withdraws = 0;
    agg.forEach(a => { if (a._id === "deposit") deposits = a.total; if (a._id === "withdraw") withdraws = a.total; });
    res.json({ success:true, balance: (deposits || 0) - (withdraws || 0), deposits, withdraws });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

exports.getRecentTransactions = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const txs = await WalletTransaction.find().sort({ createdAt: -1 }).limit(Number(limit));
    res.json({ success:true, txs });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
