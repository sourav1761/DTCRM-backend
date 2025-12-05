// const Lead = require("../models/Lead");
// const Payment = require("../models/Payment");
// const { autoWalletDeduct, autoWalletRefund } = require("../utils/walletHelper");

// // Calculate total of transaction array
// const totalFromArray = (arr = []) =>
//   arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// // =========================
// //     CREATE LEAD
// // =========================
// exports.createLead = async (req, res) => {
//   try {
//     const body = req.body;

//     const lead = await Lead.create({
//       ...body,
//       stampDutyTransactions: body.stampDutyTransactions || [],
//       registrationFeesTransactions: body.registrationFeesTransactions || [],

//       // ⭐ NEW PAID AMOUNT HISTORY ⭐
//       paidAmountTransactions: body.paidAmountTransactions || [],

//       duePaymentDate: body.duePaymentDate || null,

//       // ⭐ OPTIONAL LOAN FIELDS ⭐
//       hasLoan: body.hasLoan || false,
//       loanAmount: body.loanAmount || null,
//       tenureMonths: body.tenureMonths || null,
//       interestRate: body.interestRate || null,
//       agreementUpload: body.agreementUpload || null,
//       loanDescription: body.loanDescription || ""
//     });

//     // AUTO WALLET DEDUCTIONS (ONLY 2 FIELDS)
//     const stampTotal = totalFromArray(lead.stampDutyTransactions);
//     const regTotal = totalFromArray(lead.registrationFeesTransactions);

//     if (stampTotal > 0)
//       await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added");

//     if (regTotal > 0)
//       await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added");

//     // ⭐ CALCULATE TOTAL PAID AMOUNT ⭐
//     const paidTotal = totalFromArray(lead.paidAmountTransactions);

//     // Create payment card
//     await Payment.create({
//       lead: lead._id,
//       clientName: lead.customerName,
//       lastPaymentDate: null,
//       paidAmount: paidTotal,
//       dueAmount: lead.dueAmount || 0,
//       paymentMode: "", // history available inside lead
//       status: (lead.dueAmount || 0) <= 0 ? "fully_paid" : "partial"
//     });

//     res.status(201).json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     UPDATE LEAD
// // =========================
// exports.updateLead = async (req, res) => {
//   try {
//     const body = req.body;

//     const oldLead = await Lead.findById(req.params.id);
//     if (!oldLead)
//       return res.status(404).json({ success: false, message: "Lead not found" });

//     // Get old totals
//     const oldStamp = totalFromArray(oldLead.stampDutyTransactions);
//     const oldReg = totalFromArray(oldLead.registrationFeesTransactions);
    
//     // Get new totals
//     const newStamp = totalFromArray(body.stampDutyTransactions || []);
//     const newReg = totalFromArray(body.registrationFeesTransactions || []);

//     // Calculate differences
//     const stampDiff = newStamp - oldStamp;
//     const regDiff = newReg - oldReg;

//     // Handle wallet adjustments
//     if (stampDiff > 0) {
//       // Amount increased - deduct from wallet
//       await autoWalletDeduct(stampDiff, oldLead._id, "Stamp Duty Updated");
//     } else if (stampDiff < 0) {
//       // Amount decreased - refund to wallet
//       await autoWalletRefund(Math.abs(stampDiff), oldLead._id, "Stamp Duty Removed/Reduced");
//     }

//     if (regDiff > 0) {
//       // Amount increased - deduct from wallet
//       await autoWalletDeduct(regDiff, oldLead._id, "Registration Fees Updated");
//     } else if (regDiff < 0) {
//       // Amount decreased - refund to wallet
//       await autoWalletRefund(Math.abs(regDiff), oldLead._id, "Registration Fees Removed/Reduced");
//     }

//     // ⭐ CALCULATE NEW PAID AMOUNT TOTAL ⭐
//     const updatedPaidTransactions =
//       body.paidAmountTransactions || oldLead.paidAmountTransactions;

//     const newPaidTotal = totalFromArray(updatedPaidTransactions);

//     const updated = await Lead.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...body,

//         stampDutyTransactions: body.stampDutyTransactions || [],
//         registrationFeesTransactions: body.registrationFeesTransactions || [],

//         paidAmountTransactions: updatedPaidTransactions,
//         paidAmount: newPaidTotal,

//         duePaymentDate: body.duePaymentDate || oldLead.duePaymentDate,

//         hasLoan: body.hasLoan ?? oldLead.hasLoan,
//         loanAmount: body.loanAmount ?? oldLead.loanAmount,
//         tenureMonths: body.tenureMonths ?? oldLead.tenureMonths,
//         interestRate: body.interestRate ?? oldLead.interestRate,
//         agreementUpload: body.agreementUpload ?? oldLead.agreementUpload,
//         loanDescription: body.loanDescription ?? oldLead.loanDescription
//       },
//       { new: true }
//     );

//     // Update payment card summary
//     await Payment.findOneAndUpdate(
//       { lead: updated._id },
//       {
//         paidAmount: newPaidTotal,
//         dueAmount: updated.dueAmount,
//         status: updated.dueAmount <= 0 ? "fully_paid" : "partial"
//       }
//     );

//     res.json({ success: true, lead: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     DELETE FEE TRANSACTION
// // =========================
// exports.deleteFeeTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { feeType, transactionId } = req.body;
    
//     const lead = await Lead.findById(id);
//     if (!lead)
//       return res.status(404).json({ success: false, message: "Lead not found" });

//     // Get old totals
//     const oldStampTotal = totalFromArray(lead.stampDutyTransactions);
//     const oldRegTotal = totalFromArray(lead.registrationFeesTransactions);
    
//     let removedAmount = 0;
    
//     // Remove transaction based on fee type
//     if (feeType === "stampDuty") {
//       const transactionIndex = lead.stampDutyTransactions.findIndex(
//         t => t._id.toString() === transactionId || t.id === transactionId
//       );
      
//       if (transactionIndex !== -1) {
//         removedAmount = lead.stampDutyTransactions[transactionIndex].amount;
//         lead.stampDutyTransactions.splice(transactionIndex, 1);
//       }
//     } else if (feeType === "registrationFees") {
//       const transactionIndex = lead.registrationFeesTransactions.findIndex(
//         t => t._id.toString() === transactionId || t.id === transactionId
//       );
      
//       if (transactionIndex !== -1) {
//         removedAmount = lead.registrationFeesTransactions[transactionIndex].amount;
//         lead.registrationFeesTransactions.splice(transactionIndex, 1);
//       }
//     } else {
//       return res.status(400).json({ success: false, message: "Invalid fee type" });
//     }
    
//     if (removedAmount <= 0) {
//       return res.status(400).json({ success: false, message: "Transaction not found" });
//     }
    
//     // Get new totals
//     const newStampTotal = totalFromArray(lead.stampDutyTransactions);
//     const newRegTotal = totalFromArray(lead.registrationFeesTransactions);
    
//     // Refund to wallet if amount was removed
//     if (feeType === "stampDuty") {
//       const stampDiff = newStampTotal - oldStampTotal;
//       if (stampDiff < 0) {
//         await autoWalletRefund(Math.abs(stampDiff), lead._id, `Stamp Duty Transaction Deleted: ${removedAmount}`);
//       }
//     } else if (feeType === "registrationFees") {
//       const regDiff = newRegTotal - oldRegTotal;
//       if (regDiff < 0) {
//         await autoWalletRefund(Math.abs(regDiff), lead._id, `Registration Fee Transaction Deleted: ${removedAmount}`);
//       }
//     }
    
//     // Save updated lead
//     await lead.save();
    
//     // Update payment card summary
//     await Payment.findOneAndUpdate(
//       { lead: lead._id },
//       {
//         dueAmount: lead.dueAmount,
//         status: lead.dueAmount <= 0 ? "fully_paid" : "partial"
//       }
//     );
    
//     res.json({ 
//       success: true, 
//       message: "Transaction deleted successfully",
//       refundedAmount: removedAmount,
//       lead 
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     GET ALL LEADS
// // =========================
// exports.getLeads = async (req, res) => {
//   try {
//     const leads = await Lead.find().sort({ createdAt: -1 });
//     res.json({ success: true, leads });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     GET LEAD BY ID
// // =========================
// exports.getLeadById = async (req, res) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
//     if (!lead)
//       return res.status(404).json({ success: false, message: "Lead not found" });

//     res.json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     MARK CASE COMPLETE
// // =========================
// exports.markCaseCompletion = async (req, res) => {
//   try {
//     const lead = await Lead.findByIdAndUpdate(
//       req.params.id,
//       { caseCompleted: true },
//       { new: true }
//     );

//     res.json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };






















const Lead = require("../models/Lead");
const Payment = require("../models/Payment");
const { 
  autoWalletDeduct, 
  autoWalletRefund,
  addEstimatedReturns 
} = require("../utils/walletHelper");
const { uploadAgreement, getFileUrl, deleteFile } = require("../utils/fileUpload");

// Calculate total of transaction array
const totalFromArray = (arr = []) =>
  arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// =========================
//     CREATE LEAD
// =========================
exports.createLead = async (req, res) => {
  try {
    const body = req.body;

    const lead = await Lead.create({
      ...body,
      stampDutyTransactions: body.stampDutyTransactions || [],
      registrationFeesTransactions: body.registrationFeesTransactions || [],
      paidAmountTransactions: body.paidAmountTransactions || [],
      stationeryExpenses: body.stationeryExpenses || [], // ⭐ ADDED
      duePaymentDate: body.duePaymentDate || null,
      hasLoan: body.hasLoan || false,
      loanAmount: body.loanAmount || null,
      tenureMonths: body.tenureMonths || null,
      interestRate: body.interestRate || null,
      agreementUpload: body.agreementUpload || null,
      loanDescription: body.loanDescription || ""
    });

    // AUTO WALLET DEDUCTIONS (ONLY 2 FIELDS)
    const stampTotal = totalFromArray(lead.stampDutyTransactions);
    const regTotal = totalFromArray(lead.registrationFeesTransactions);

    if (stampTotal > 0) {
      await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added");
      // ⭐ ADD ESTIMATED RETURNS (1.5% of stamp duty)
      const estimatedReturnAmount = stampTotal * 0.015;
      await addEstimatedReturns(estimatedReturnAmount, lead._id, `1.5% Returns from Stamp Duty: ₹${stampTotal}`);
    }

    if (regTotal > 0) {
      await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added");
    }

    // ⭐ CALCULATE TOTAL PAID AMOUNT ⭐
    const paidTotal = totalFromArray(lead.paidAmountTransactions);

    // Create payment card
    await Payment.create({
      lead: lead._id,
      clientName: lead.customerName,
      lastPaymentDate: null,
      paidAmount: paidTotal,
      dueAmount: lead.dueAmount || 0,
      paymentMode: "",
      status: (lead.dueAmount || 0) <= 0 ? "fully_paid" : "partial"
    });

    res.status(201).json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     UPDATE LEAD
// =========================
exports.updateLead = async (req, res) => {
  try {
    const body = req.body;

    const oldLead = await Lead.findById(req.params.id);
    if (!oldLead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    // Get old totals
    const oldStamp = totalFromArray(oldLead.stampDutyTransactions);
    const oldReg = totalFromArray(oldLead.registrationFeesTransactions);
    
    // Get new totals
    const newStamp = totalFromArray(body.stampDutyTransactions || []);
    const newReg = totalFromArray(body.registrationFeesTransactions || []);

    // Calculate differences
    const stampDiff = newStamp - oldStamp;
    const regDiff = newReg - oldReg;

    // Handle wallet adjustments
    if (stampDiff > 0) {
      // Amount increased - deduct from wallet
      await autoWalletDeduct(stampDiff, oldLead._id, "Stamp Duty Updated");
      // ⭐ ADD ESTIMATED RETURNS for the increased amount
      const estimatedReturnAmount = stampDiff * 0.015;
      await addEstimatedReturns(estimatedReturnAmount, oldLead._id, `1.5% Returns from Stamp Duty Update`);
    } else if (stampDiff < 0) {
      // Amount decreased - refund to wallet
      await autoWalletRefund(Math.abs(stampDiff), oldLead._id, "Stamp Duty Removed/Reduced");
      // ⭐ REMOVE ESTIMATED RETURNS for the decreased amount
      const estimatedReturnAmount = Math.abs(stampDiff) * 0.015;
      await autoWalletDeduct(estimatedReturnAmount, oldLead._id, "Adjust Estimated Returns for Stamp Duty Reduction");
    }

    if (regDiff > 0) {
      // Amount increased - deduct from wallet
      await autoWalletDeduct(regDiff, oldLead._id, "Registration Fees Updated");
    } else if (regDiff < 0) {
      // Amount decreased - refund to wallet
      await autoWalletRefund(Math.abs(regDiff), oldLead._id, "Registration Fees Removed/Reduced");
    }

    // ⭐ CALCULATE NEW PAID AMOUNT TOTAL ⭐
    const updatedPaidTransactions =
      body.paidAmountTransactions || oldLead.paidAmountTransactions;

    const newPaidTotal = totalFromArray(updatedPaidTransactions);

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        stampDutyTransactions: body.stampDutyTransactions || [],
        registrationFeesTransactions: body.registrationFeesTransactions || [],
        paidAmountTransactions: updatedPaidTransactions,
        stationeryExpenses: body.stationeryExpenses || oldLead.stationeryExpenses, // ⭐ ADDED
        paidAmount: newPaidTotal,
        duePaymentDate: body.duePaymentDate || oldLead.duePaymentDate,
        hasLoan: body.hasLoan ?? oldLead.hasLoan,
        loanAmount: body.loanAmount ?? oldLead.loanAmount,
        tenureMonths: body.tenureMonths ?? oldLead.tenureMonths,
        interestRate: body.interestRate ?? oldLead.interestRate,
        agreementUpload: body.agreementUpload ?? oldLead.agreementUpload,
        loanDescription: body.loanDescription ?? oldLead.loanDescription
      },
      { new: true }
    );

    // Update payment card summary
    await Payment.findOneAndUpdate(
      { lead: updated._id },
      {
        paidAmount: newPaidTotal,
        dueAmount: updated.dueAmount,
        status: updated.dueAmount <= 0 ? "fully_paid" : "partial"
      }
    );

    res.json({ success: true, lead: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE FEE TRANSACTION
// =========================
exports.deleteFeeTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { feeType, transactionId } = req.body;
    
    const lead = await Lead.findById(id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    // Get old totals
    const oldStampTotal = totalFromArray(lead.stampDutyTransactions);
    const oldRegTotal = totalFromArray(lead.registrationFeesTransactions);
    
    let removedAmount = 0;
    let removedTransaction = null;
    
    // Remove transaction based on fee type
    if (feeType === "stampDuty") {
      const transactionIndex = lead.stampDutyTransactions.findIndex(
        t => t._id.toString() === transactionId || t.id === transactionId
      );
      
      if (transactionIndex !== -1) {
        removedTransaction = lead.stampDutyTransactions[transactionIndex];
        removedAmount = removedTransaction.amount;
        lead.stampDutyTransactions.splice(transactionIndex, 1);
      }
    } else if (feeType === "registrationFees") {
      const transactionIndex = lead.registrationFeesTransactions.findIndex(
        t => t._id.toString() === transactionId || t.id === transactionId
      );
      
      if (transactionIndex !== -1) {
        removedTransaction = lead.registrationFeesTransactions[transactionIndex];
        removedAmount = removedTransaction.amount;
        lead.registrationFeesTransactions.splice(transactionIndex, 1);
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid fee type" });
    }
    
    if (removedAmount <= 0) {
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }
    
    // Get new totals
    const newStampTotal = totalFromArray(lead.stampDutyTransactions);
    const newRegTotal = totalFromArray(lead.registrationFeesTransactions);
    
    // Refund to wallet if amount was removed
    if (feeType === "stampDuty") {
      const stampDiff = newStampTotal - oldStampTotal;
      if (stampDiff < 0) {
        await autoWalletRefund(Math.abs(stampDiff), lead._id, `Stamp Duty Transaction Deleted: ${removedAmount}`);
        // ⭐ ALSO DEDUCT THE ESTIMATED RETURNS (1.5%) FROM WALLET
        const estimatedReturnAmount = Math.abs(stampDiff) * 0.015;
        await autoWalletDeduct(estimatedReturnAmount, lead._id, "Adjust Estimated Returns for Deleted Stamp Duty");
      }
    } else if (feeType === "registrationFees") {
      const regDiff = newRegTotal - oldRegTotal;
      if (regDiff < 0) {
        await autoWalletRefund(Math.abs(regDiff), lead._id, `Registration Fee Transaction Deleted: ${removedAmount}`);
      }
    }
    
    // Save updated lead
    await lead.save();
    
    // Update payment card summary
    await Payment.findOneAndUpdate(
      { lead: lead._id },
      {
        dueAmount: lead.dueAmount,
        status: lead.dueAmount <= 0 ? "fully_paid" : "partial"
      }
    );
    
    res.json({ 
      success: true, 
      message: "Transaction deleted successfully",
      refundedAmount: removedAmount,
      lead 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     UPLOAD AGREEMENT FILE
// =========================
exports.uploadAgreement = async (req, res) => {
  try {
    // Handle file upload using multer middleware
    uploadAgreement(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const { id } = req.params;
      const lead = await Lead.findById(id);
      
      if (!lead) {
        // Delete uploaded file if lead not found
        if (req.file) deleteFile(req.file.filename);
        return res.status(404).json({ success: false, message: "Lead not found" });
      }

      // Delete old file if exists
      if (lead.agreementUpload) {
        const oldFilename = lead.agreementUpload.split('/').pop();
        deleteFile(oldFilename);
      }

      // Update lead with new file path
      const fileUrl = getFileUrl(req.file.filename);
      lead.agreementUpload = fileUrl;
      await lead.save();

      res.json({
        success: true,
        message: "Agreement uploaded successfully",
        fileUrl: fileUrl,
        lead
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
//     DELETE AGREEMENT FILE
// =========================
exports.deleteAgreement = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);
    
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (!lead.agreementUpload) {
      return res.status(400).json({ success: false, message: "No agreement file to delete" });
    }

    // Delete file from storage
    const filename = lead.agreementUpload.split('/').pop();
    deleteFile(filename);

    // Remove file reference from lead
    lead.agreementUpload = null;
    await lead.save();

    res.json({
      success: true,
      message: "Agreement deleted successfully",
      lead
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
//     GET ALL LEADS
// =========================
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET LEAD BY ID
// =========================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     MARK CASE COMPLETE
// =========================
exports.markCaseCompletion = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { caseCompleted: true },
      { new: true }
    );

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     ADD STATIONERY EXPENSE
// =========================
exports.addStationeryExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, amount, date, remarks } = req.body;
    
    const lead = await Lead.findById(id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    // Generate unique ID for the expense
    const newId = lead.stationeryExpenses.length > 0 
      ? Math.max(...lead.stationeryExpenses.map(e => e.id)) + 1 
      : 1;

    const newExpense = {
      id: newId,
      itemName,
      amount: Number(amount),
      date: date || new Date().toISOString().split('T')[0],
      remarks: remarks || ""
    };

    lead.stationeryExpenses.push(newExpense);
    await lead.save();

    res.json({
      success: true,
      message: "Stationery expense added successfully",
      expense: newExpense,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE STATIONERY EXPENSE
// =========================
exports.deleteStationeryExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseId } = req.body;
    
    const lead = await Lead.findById(id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    const expenseIndex = lead.stationeryExpenses.findIndex(
      e => e._id.toString() === expenseId || e.id === Number(expenseId)
    );
    
    if (expenseIndex === -1) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    const removedExpense = lead.stationeryExpenses[expenseIndex];
    lead.stationeryExpenses.splice(expenseIndex, 1);
    await lead.save();

    res.json({
      success: true,
      message: "Stationery expense deleted successfully",
      removedExpense,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};