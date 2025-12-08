const Lead = require("../models/Lead");
const Payment = require("../models/Payment");
const { autoWalletDeduct, autoWalletRefund } = require("../utils/walletHelper");
const fs = require("fs");
const path = require("path");

// Calculate total of transaction array
const totalFromArray = (arr = []) =>
  arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// =========================
//     CREATE LEAD
// =========================
exports.createLead = async (req, res) => {
  try {
    const body = req.body;
    
    // Handle file upload if present
    let agreementUploadPath = null;
    if (req.file) {
      agreementUploadPath = `/uploads/${req.file.filename}`;
    }

    const lead = await Lead.create({
      ...body,
      stampDutyTransactions: body.stampDutyTransactions || [],
      registrationFeesTransactions: body.registrationFeesTransactions || [],
      // ⭐ NEW: Initialize stationery expenses
      stationeryExpenses: body.stationeryExpenses || 0,
      // ⭐ NEW PAID AMOUNT HISTORY WITH REMARKS ⭐
      paidAmountTransactions: body.paidAmountTransactions || [],
      duePaymentDate: body.duePaymentDate || null,
      // ⭐ OPTIONAL LOAN FIELDS ⭐
      hasLoan: body.hasLoan || false,
      loanAmount: body.loanAmount || null,
      tenureMonths: body.tenureMonths || null,
      interestRate: body.interestRate || null,
      agreementUpload: agreementUploadPath || body.agreementUpload || null,
      loanDescription: body.loanDescription || ""
    });

    // AUTO WALLET DEDUCTIONS (ONLY 2 FIELDS)
    const stampTotal = totalFromArray(lead.stampDutyTransactions);
    const regTotal = totalFromArray(lead.registrationFeesTransactions);

    if (stampTotal > 0)
      await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added", true); // ⭐ isStampDuty = true

    if (regTotal > 0)
      await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added", false);

    // ⭐ CALCULATE TOTAL PAID AMOUNT ⭐
    const paidTotal = totalFromArray(lead.paidAmountTransactions);

    // Create payment card
    await Payment.create({
      lead: lead._id,
      clientName: lead.customerName,
      lastPaymentDate: null,
      paidAmount: paidTotal,
      dueAmount: lead.dueAmount || 0,
      paymentMode: "", // history available inside lead
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

    // Handle file upload if present
    let agreementUploadPath = oldLead.agreementUpload;
    if (req.file) {
      // Delete old file if exists
      if (oldLead.agreementUpload && oldLead.agreementUpload.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, '..', oldLead.agreementUpload);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      agreementUploadPath = `/uploads/${req.file.filename}`;
    }

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
      await autoWalletDeduct(stampDiff, oldLead._id, "Stamp Duty Updated", true); // ⭐ isStampDuty = true
    } else if (stampDiff < 0) {
      // Amount decreased - refund to wallet
      await autoWalletRefund(Math.abs(stampDiff), oldLead._id, "Stamp Duty Removed/Reduced", true); // ⭐ isStampDuty = true
    }

    if (regDiff > 0) {
      // Amount increased - deduct from wallet
      await autoWalletDeduct(regDiff, oldLead._id, "Registration Fees Updated", false);
    } else if (regDiff < 0) {
      // Amount decreased - refund to wallet
      await autoWalletRefund(Math.abs(regDiff), oldLead._id, "Registration Fees Removed/Reduced", false);
    }

    // ⭐ CALCULATE NEW PAID AMOUNT TOTAL ⭐
    const updatedPaidTransactions = body.paidAmountTransactions || oldLead.paidAmountTransactions;
    const newPaidTotal = totalFromArray(updatedPaidTransactions);

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        ...body,
        stampDutyTransactions: body.stampDutyTransactions || [],
        registrationFeesTransactions: body.registrationFeesTransactions || [],
        // ⭐ NEW: Update stationery expenses
        stationeryExpenses: body.stationeryExpenses !== undefined ? body.stationeryExpenses : oldLead.stationeryExpenses,
        paidAmountTransactions: updatedPaidTransactions,
        paidAmount: newPaidTotal,
        duePaymentDate: body.duePaymentDate || oldLead.duePaymentDate,
        hasLoan: body.hasLoan ?? oldLead.hasLoan,
        loanAmount: body.loanAmount ?? oldLead.loanAmount,
        tenureMonths: body.tenureMonths ?? oldLead.tenureMonths,
        interestRate: body.interestRate ?? oldLead.interestRate,
        agreementUpload: agreementUploadPath,
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
        await autoWalletRefund(
          Math.abs(stampDiff), 
          lead._id, 
          `Stamp Duty Transaction Deleted: ${removedAmount}`,
          true // ⭐ isStampDuty = true
        );
      }
    } else if (feeType === "registrationFees") {
      const regDiff = newRegTotal - oldRegTotal;
      if (regDiff < 0) {
        await autoWalletRefund(
          Math.abs(regDiff), 
          lead._id, 
          `Registration Fee Transaction Deleted: ${removedAmount}`,
          false
        );
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
//     UPLOAD AGREEMENT
// =========================
exports.uploadAgreement = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded. Please select a PDF or image file." 
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      // Delete uploaded file if lead not found
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Delete old file if exists
    if (lead.agreementUpload && lead.agreementUpload.startsWith('/uploads/')) {
      // const oldFilePath = path.join(__dirname, '..', lead.agreementUpload);
      // inside uploadAgreement
const oldFilePath = path.join(__dirname, "..", "..", lead.agreementUpload);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Update lead with new file path
    lead.agreementUpload = `/uploads/${req.file.filename}`;
    await lead.save();

    res.json({ 
      success: true, 
      message: "Agreement uploaded successfully",
      filePath: lead.agreementUpload,
      fileName: req.file.filename,
      lead: {
        _id: lead._id,
        customerName: lead.customerName,
        agreementUpload: lead.agreementUpload
      }
    });
  } catch (err) {
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.addStationeryTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date, timestamp } = req.body;

    const lead = await Lead.findById(id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    const newTransaction = {
      id: Date.now(),
      amount: Number(amount),
      description: description || "Stationery expense",
      date: date,
      timestamp: timestamp
    };

    lead.stationeryTransactions.push(newTransaction);

    // Update total
    lead.stationeryExpenses = lead.stationeryTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    await lead.save();

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStationeryTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;

    const lead = await Lead.findById(id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Lead not found" });

    // Filter out the transaction
    lead.stationeryTransactions = lead.stationeryTransactions.filter(
      (t) => t.id != transactionId && t._id != transactionId
    );

    // Update total
    lead.stationeryExpenses = lead.stationeryTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    await lead.save();

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
