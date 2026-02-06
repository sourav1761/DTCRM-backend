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
const mongoose = require("mongoose");

// =======================
// CREATE LOAN
// =======================
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

    const totalRecoverableAmount = Number(loanAmount) + Number(extraFee);
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



// =======================
// GET ALL LOANS
// =======================
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET SINGLE LOAN
// =======================
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan ID format",
      });
    }

    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.json({ success: true, loan });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// UPDATE LOAN
// =======================
exports.updateLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan ID format",
      });
    }

    // Recalculate amounts if loanAmount or extraFee changed
    if (updatedData.loanAmount || updatedData.extraFee !== undefined) {
      const currentLoan = await Loan.findById(id);
      if (!currentLoan) {
        return res.status(404).json({
          success: false,
          message: "Loan not found",
        });
      }

      const loanAmount = updatedData.loanAmount || currentLoan.loanAmount;
      const extraFee = updatedData.extraFee !== undefined ? updatedData.extraFee : currentLoan.extraFee;
      
      updatedData.totalRecoverableAmount = Number(loanAmount) + Number(extraFee);
      updatedData.pendingAmount = updatedData.totalRecoverableAmount;
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.json({
      success: true,
      message: "Loan updated successfully",
      loan: updatedLoan,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// DELETE LOAN
// =======================
exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan ID format",
      });
    }

    const deletedLoan = await Loan.findByIdAndDelete(id);
    if (!deletedLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET LOANS BY CLIENT
// =======================
exports.getLoansByClient = async (req, res) => {
  try {
    const { clientName } = req.params;
    const loans = await Loan.find({ 
      clientName: { $regex: clientName, $options: 'i' } 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, loans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// UPDATE PENDING AMOUNT
// =======================
exports.updatePendingAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { pendingAmount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan ID format",
      });
    }

    if (pendingAmount === undefined || pendingAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid pending amount",
      });
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { pendingAmount: Number(pendingAmount) },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    res.json({
      success: true,
      message: "Pending amount updated successfully",
      loan: updatedLoan,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
