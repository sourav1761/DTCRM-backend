
const Credit = require("../models/Credit");
const WalletTransaction = require("../models/WalletTransaction");
const CreditHistory = require("../models/CreditHistory");

// ===============================
// ADD ACCOUNT CREDIT
// ===============================
exports.addCredit = async (req, res) => {
  try {
    const { accountNumber, bank, creditAmount, note } = req.body;

    // 1️⃣ Create credit entry
    const entry = await Credit.create({
      type: "account_credit",
      accountNumber,
      bank,
      creditAmount,
      note
    });

    // 2️⃣ Add creditAmount to Wallet (Automatic deposit)
    await WalletTransaction.create({
      type: "deposit",
      amount: Number(creditAmount),
      method: "credit_page",
      reference: "Account Credit Auto Deposit"
    });

    // 3️⃣ Add to credit history
    await CreditHistory.create({
      type: "account_credit",
      amount: Number(creditAmount),
      note
    });

    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// ADD LOAN ENTRY
// ===============================
exports.addLoanEntry = async (req, res) => {
  try {
    const { clientName, loanAmount, interestRate, tenureMonths, description } =
      req.body;

    const agreementFiles = (req.files || []).map((f) => f.path);

    const entry = await Credit.create({
      type: "loan",
      clientName,
      loanAmount: Number(loanAmount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      agreementFiles,
      description
    });

    // loan history
    await CreditHistory.create({
      type: "loan",
      amount: Number(loanAmount),
      note: description
    });

    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// GET RECENT CREDITS + LOANS
// ===============================
exports.getRecentCreditsLoans = async (req, res) => {
  try {
    const recent = await Credit.find().sort({ date: -1 }).limit(50);
    res.json({ success: true, recent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===============================
// GET CREDIT HISTORY
// ===============================
exports.getCreditHistory = async (req, res) => {
  try {
    const history = await CreditHistory.find().sort({ date: -1 });
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
