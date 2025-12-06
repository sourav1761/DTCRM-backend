
const Credit = require("../models/Credit");
const WalletTransaction = require("../models/WalletTransaction");
const CreditHistory = require("../models/CreditHistory");
const fs = require("fs");
const path = require("path");

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

// ADD LOAN ENTRY (WITH FILE UPLOAD)
// ===============================
exports.addLoanEntry = async (req, res) => {
  try {
    const { clientName, loanAmount, interestRate, tenureMonths, description } =
      req.body;

    // Multiple uploaded files
    const agreementFiles = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const entry = await Credit.create({
      type: "loan",
      clientName,
      loanAmount: Number(loanAmount),
      interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths),
      agreementFiles, // store file URLs
      description
    });

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



// ===============================
// UPDATE LOAN ENTRY
// ===============================
exports.updateLoanEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const oldEntry = await Credit.findById(id);
    if (!oldEntry) {
      return res.status(404).json({ success: false, message: "Credit entry not found" });
    }

    // Fields from request body
    const {
      clientName,
      loanAmount,
      interestRate,
      tenureMonths,
      description
    } = req.body;

    // Uploaded files
    let newFiles = [];
    if (req.files && req.files.length > 0) {
      newFiles = req.files.map((f) => `/uploads/${f.filename}`);

      // Delete old files if new files provided
      if (oldEntry.agreementFiles && oldEntry.agreementFiles.length > 0) {
        oldEntry.agreementFiles.forEach((filePath) => {
          const fullPath = path.join(__dirname, "..", "..", filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });
      }
    }

    // Final updated files = new uploaded OR old files (if no new upload)
    const updatedFiles = newFiles.length > 0 ? newFiles : oldEntry.agreementFiles;

    const updatedEntry = await Credit.findByIdAndUpdate(
      id,
      {
        clientName: clientName ?? oldEntry.clientName,
        loanAmount: loanAmount ?? oldEntry.loanAmount,
        interestRate: interestRate ?? oldEntry.interestRate,
        tenureMonths: tenureMonths ?? oldEntry.tenureMonths,
        agreementFiles: updatedFiles,
        description: description ?? oldEntry.description
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Loan entry updated successfully",
      entry: updatedEntry
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
