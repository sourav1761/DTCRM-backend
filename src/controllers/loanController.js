// const Loan = require("../models/Loan");

// // ==========================
// // CREATE LOAN
// // ==========================
// exports.createLoan = async (req, res) => {
//   try {
//     const {
//       clientName,
//       mobileNumber,
//       aadharCard,
//       panCard,
//       loanType,
//       loanAmount,
//       extraFee = 0,
//       loanDate,
//       pendingAmountDate,
//     } = req.body;

//     if (
//       !clientName ||
//       !mobileNumber ||
//       !aadharCard ||
//       !panCard ||
//       !loanType ||
//       !loanAmount ||
//       !loanDate ||
//       !pendingAmountDate
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const totalRecoverableAmount =
//       Number(loanAmount) + Number(extraFee);

//     const pendingAmount = totalRecoverableAmount;

//     const documents = (req.files || []).map((file) => ({
//       fileName: file.originalname,
//       filePath: `/uploads/loans/${file.filename}`,
//       fileType: file.mimetype,
//     }));

//     const loan = await Loan.create({
//       clientName,
//       mobileNumber,
//       aadharCard,
//       panCard,
//       loanType,
//       loanAmount,
//       extraFee,
//       loanDate,
//       totalRecoverableAmount,
//       pendingAmount,
//       pendingAmountDate,
//       documents,
//     });

//     res.status(201).json({ success: true, loan });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // ==========================
// // GET ALL LOANS
// // ==========================
// exports.getLoans = async (req, res) => {
//   const loans = await Loan.find().sort({ createdAt: -1 });
//   res.json({ success: true, loans });
// };

// // ==========================
// // GET SINGLE LOAN
// // ==========================
// exports.getLoanById = async (req, res) => {
//   const loan = await Loan.findById(req.params.id);
//   if (!loan)
//     return res.status(404).json({ success: false, message: "Not found" });

//   res.json({ success: true, loan });
// };

// // ==========================
// // DELETE LOAN
// // ==========================
// exports.deleteLoan = async (req, res) => {
//   await Loan.findByIdAndDelete(req.params.id);
//   res.json({ success: true });
// };
















const Loan = require("../models/Loan");

// ==========================
// CREATE LOAN
// ==========================
// exports.createLoan = async (req, res) => {
//   try {
//     const {
//       clientName,
//       mobileNumber,
//       aadharCard,
//       panCard,
//       loanType,
//       loanAmount,
//       extraFee = 0,
//       loanDate,
//       pendingAmountDate,
//     } = req.body;

//     if (
//       !clientName ||
//       !mobileNumber ||
//       !aadharCard ||
//       !panCard ||
//       !loanType ||
//       !loanAmount ||
//       !loanDate ||
//       !pendingAmountDate
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     const totalRecoverableAmount =
//       Number(loanAmount) + Number(extraFee);

//     const pendingAmount = totalRecoverableAmount;

//     const documents = (req.files || []).map((file) => ({
//       fileName: file.originalname,
//       filePath: `/uploads/loans/${file.filename}`,
//       fileType: file.mimetype,
//     }));

//     const loan = await Loan.create({
//       clientName,
//       mobileNumber,
//       aadharCard,
//       panCard,
//       loanType,
//       loanAmount,
//       extraFee,
//       loanDate,
//       totalRecoverableAmount,
//       pendingAmount,
//       pendingAmountDate,
//       documents,
//     });

//     res.status(201).json({ success: true, loan });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



exports.createLoan = async (req, res) => {
  try {

    
    const {
      clientName,
      mobileNumber,
      aadharCard,
      panCard,
      loanType,
      loanAmount,
      extraFee = 0,
      loanDate,
      pendingAmountDate,
    } = req.body;

    // ✅ REQUIRED FIELDS CHECK
    const missingFields = [];

    if (!clientName) missingFields.push("clientName");
    if (!mobileNumber) missingFields.push("mobileNumber");
    if (!aadharCard) missingFields.push("aadharCard");
    if (!panCard) missingFields.push("panCard");
    if (!loanType) missingFields.push("loanType");
    if (!loanAmount) missingFields.push("loanAmount");
    if (!loanDate) missingFields.push("loanDate");
    if (!pendingAmountDate) missingFields.push("pendingAmountDate");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const totalRecoverableAmount =
      Number(loanAmount) + Number(extraFee);

    const pendingAmount = totalRecoverableAmount;

    const documents = (req.files || []).map((file) => ({
      fileName: file.originalname,
      filePath: `/uploads/loans/${file.filename}`,
      fileType: file.mimetype,
    }));

    const loan = await Loan.create({
      clientName,
      mobileNumber,
      aadharCard,
      panCard,
      loanType,
      loanAmount,
      extraFee,
      loanDate,
      totalRecoverableAmount,
      pendingAmount,
      pendingAmountDate,
      documents,
    });

    res.status(201).json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ==========================
// GET ALL LOANS
// ==========================
exports.getLoans = async (req, res) => {
  const loans = await Loan.find().sort({ createdAt: -1 });
  res.json({ success: true, loans });
};

// ==========================
// GET SINGLE LOAN
// ==========================
exports.getLoanById = async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan)
    return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, loan });
};

// ==========================
// DELETE LOAN
// ==========================
exports.deleteLoan = async (req, res) => {
  await Loan.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
