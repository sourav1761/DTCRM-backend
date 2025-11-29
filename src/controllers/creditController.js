const Credit = require("../models/Credit");



// add account credit entry
exports.addCredit = async (req, res) => {
  try {
    const { accountNumber, bank, creditAmount, note } = req.body;
    const entry = await Credit.create({
      type: "account_credit",
      accountNumber, bank, creditAmount, note
    });
    res.status(201).json({ success:true, entry });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

// add loan entry (files handled by multer)
exports.addLoanEntry = async (req, res) => {
  try {
    const { clientName, loanAmount, interestRate, tenureMonths, description } = req.body;
    const agreementFiles = (req.files || []).map(f => f.path);
    const entry = await Credit.create({
      type: "loan",
      clientName, loanAmount: Number(loanAmount), interestRate: Number(interestRate),
      tenureMonths: Number(tenureMonths), agreementFiles, description
    });
    res.status(201).json({ success:true, entry });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

exports.getRecentCreditsLoans = async (req, res) => {
  try {
    const recent = await Credit.find().sort({ date: -1 }).limit(50);
    res.json({ success:true, recent });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
