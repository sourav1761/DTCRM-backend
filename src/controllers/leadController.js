// const Lead = require("../models/Lead");
// const Payment = require("../models/Payment");
// const { autoWalletDeduct, autoWalletRefund } = require("../utils/walletHelper");
// const fs = require("fs");
// const path = require("path");

// // Calculate total of transaction array
// const totalFromArray = (arr = []) =>
//   arr.reduce((sum, t) => sum + Number(t.amount || 0), 0);

// // =========================
// //     CREATE LEAD
// // =========================
// exports.createLead = async (req, res) => {
//   try {
//     const body = req.body;
    
//     // Handle file upload if present
//     let agreementUploadPath = null;
//     if (req.file) {
//       agreementUploadPath = `/uploads/${req.file.filename}`;
//     }

//     const lead = await Lead.create({
//       ...body,
//       stampDutyTransactions: body.stampDutyTransactions || [],
//       registrationFeesTransactions: body.registrationFeesTransactions || [],
//       // ⭐ NEW: Initialize stationery expenses
//       stationeryExpenses: body.stationeryExpenses || 0,
//       // ⭐ NEW PAID AMOUNT HISTORY WITH REMARKS ⭐
//       paidAmountTransactions: body.paidAmountTransactions || [],
//       duePaymentDate: body.duePaymentDate || null,
//       // ⭐ OPTIONAL LOAN FIELDS ⭐
//       hasLoan: body.hasLoan || false,
//       loanAmount: body.loanAmount || null,
//       tenureMonths: body.tenureMonths || null,
//       interestRate: body.interestRate || null,
//       agreementUpload: agreementUploadPath || body.agreementUpload || null,
//       loanDescription: body.loanDescription || ""
//     });

//     // AUTO WALLET DEDUCTIONS (ONLY 2 FIELDS)
//     const stampTotal = totalFromArray(lead.stampDutyTransactions);
//     const regTotal = totalFromArray(lead.registrationFeesTransactions);

//     if (stampTotal > 0)
//       await autoWalletDeduct(stampTotal, lead._id, "Stamp Duty Added", true); // ⭐ isStampDuty = true

//     if (regTotal > 0)
//       await autoWalletDeduct(regTotal, lead._id, "Registration Fee Added", false);

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

//     // Handle file upload if present
//     let agreementUploadPath = oldLead.agreementUpload;
//     if (req.file) {
//       // Delete old file if exists
//       if (oldLead.agreementUpload && oldLead.agreementUpload.startsWith('/uploads/')) {
//         const oldFilePath = path.join(__dirname, '..', oldLead.agreementUpload);
//         if (fs.existsSync(oldFilePath)) {
//           fs.unlinkSync(oldFilePath);
//         }
//       }
//       agreementUploadPath = `/uploads/${req.file.filename}`;
//     }

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
//       await autoWalletDeduct(stampDiff, oldLead._id, "Stamp Duty Updated", true); // ⭐ isStampDuty = true
//     } else if (stampDiff < 0) {
//       // Amount decreased - refund to wallet
//       await autoWalletRefund(Math.abs(stampDiff), oldLead._id, "Stamp Duty Removed/Reduced", true); // ⭐ isStampDuty = true
//     }

//     if (regDiff > 0) {
//       // Amount increased - deduct from wallet
//       await autoWalletDeduct(regDiff, oldLead._id, "Registration Fees Updated", false);
//     } else if (regDiff < 0) {
//       // Amount decreased - refund to wallet
//       await autoWalletRefund(Math.abs(regDiff), oldLead._id, "Registration Fees Removed/Reduced", false);
//     }

//     // ⭐ CALCULATE NEW PAID AMOUNT TOTAL ⭐
//     const updatedPaidTransactions = body.paidAmountTransactions || oldLead.paidAmountTransactions;
//     const newPaidTotal = totalFromArray(updatedPaidTransactions);

//     const updated = await Lead.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...body,
//         stampDutyTransactions: body.stampDutyTransactions || [],
//         registrationFeesTransactions: body.registrationFeesTransactions || [],
//         // ⭐ NEW: Update stationery expenses
//         stationeryExpenses: body.stationeryExpenses !== undefined ? body.stationeryExpenses : oldLead.stationeryExpenses,
//         paidAmountTransactions: updatedPaidTransactions,
//         paidAmount: newPaidTotal,
//         duePaymentDate: body.duePaymentDate || oldLead.duePaymentDate,
//         hasLoan: body.hasLoan ?? oldLead.hasLoan,
//         loanAmount: body.loanAmount ?? oldLead.loanAmount,
//         tenureMonths: body.tenureMonths ?? oldLead.tenureMonths,
//         interestRate: body.interestRate ?? oldLead.interestRate,
//         agreementUpload: agreementUploadPath,
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
//     let removedTransaction = null;
    
//     // Remove transaction based on fee type
//     if (feeType === "stampDuty") {
//       const transactionIndex = lead.stampDutyTransactions.findIndex(
//         t => t._id.toString() === transactionId || t.id === transactionId
//       );
      
//       if (transactionIndex !== -1) {
//         removedTransaction = lead.stampDutyTransactions[transactionIndex];
//         removedAmount = removedTransaction.amount;
//         lead.stampDutyTransactions.splice(transactionIndex, 1);
//       }
//     } else if (feeType === "registrationFees") {
//       const transactionIndex = lead.registrationFeesTransactions.findIndex(
//         t => t._id.toString() === transactionId || t.id === transactionId
//       );
      
//       if (transactionIndex !== -1) {
//         removedTransaction = lead.registrationFeesTransactions[transactionIndex];
//         removedAmount = removedTransaction.amount;
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
//         await autoWalletRefund(
//           Math.abs(stampDiff), 
//           lead._id, 
//           `Stamp Duty Transaction Deleted: ${removedAmount}`,
//           true // ⭐ isStampDuty = true
//         );
//       }
//     } else if (feeType === "registrationFees") {
//       const regDiff = newRegTotal - oldRegTotal;
//       if (regDiff < 0) {
//         await autoWalletRefund(
//           Math.abs(regDiff), 
//           lead._id, 
//           `Registration Fee Transaction Deleted: ${removedAmount}`,
//           false
//         );
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


// // =========================
// //     UPLOAD AGREEMENT
// // =========================
// exports.uploadAgreement = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "No file uploaded. Please select a PDF or image file." 
//       });
//     }

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       // Delete uploaded file if lead not found
//       if (req.file.path) {
//         fs.unlinkSync(req.file.path);
//       }
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     // Delete old file if exists
//     if (lead.agreementUpload && lead.agreementUpload.startsWith('/uploads/')) {
//       // const oldFilePath = path.join(__dirname, '..', lead.agreementUpload);
//       // inside uploadAgreement
// const oldFilePath = path.join(__dirname, "..", "..", lead.agreementUpload);

//       if (fs.existsSync(oldFilePath)) {
//         fs.unlinkSync(oldFilePath);
//       }
//     }

//     // Update lead with new file path
//     lead.agreementUpload = `/uploads/${req.file.filename}`;
//     await lead.save();

//     res.json({ 
//       success: true, 
//       message: "Agreement uploaded successfully",
//       filePath: lead.agreementUpload,
//       fileName: req.file.filename,
//       lead: {
//         _id: lead._id,
//         customerName: lead.customerName,
//         agreementUpload: lead.agreementUpload
//       }
//     });
//   } catch (err) {
//     // Clean up uploaded file if error occurs
//     if (req.file && req.file.path) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// exports.addStationeryTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { amount, description, date, timestamp } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead)
//       return res.status(404).json({ success: false, message: "Lead not found" });

//     const newTransaction = {
//       id: Date.now(),
//       amount: Number(amount),
//       description: description || "Stationery expense",
//       date: date,
//       timestamp: timestamp
//     };

//     lead.stationeryTransactions.push(newTransaction);

//     // Update total
//     lead.stationeryExpenses = lead.stationeryTransactions.reduce(
//       (sum, t) => sum + Number(t.amount || 0),
//       0
//     );

//     await lead.save();

//     res.json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// exports.deleteStationeryTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { transactionId } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead)
//       return res.status(404).json({ success: false, message: "Lead not found" });

//     // Filter out the transaction
//     lead.stationeryTransactions = lead.stationeryTransactions.filter(
//       (t) => t.id != transactionId && t._id != transactionId
//     );

//     // Update total
//     lead.stationeryExpenses = lead.stationeryTransactions.reduce(
//       (sum, t) => sum + Number(t.amount || 0),
//       0
//     );

//     await lead.save();

//     res.json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };










const Lead = require("../models/Lead");
const fs = require("fs");
const path = require("path");

// Helper function to delete files
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", "..", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// =========================
//     CREATE LEAD STEP 1
// =========================
exports.createLeadStep1 = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      email,
      address,
      reference,
      agentName,
      firstAmount,
      documentType,
      leadDate,
      action // "save" or "continue"
    } = req.body;

    // Validate required fields
    if (!customerName || !mobileNumber || !leadDate) {
      return res.status(400).json({
        success: false,
        message: "Customer name, mobile number, and lead date are required"
      });
    }

    const leadData = {
      customerName,
      mobileNumber,
      email: email || "",
      address: address || "",
      reference: reference || "direct",
      agentName: reference === "agent" ? agentName : "",
      firstAmount: firstAmount ? parseFloat(firstAmount) : 0,
      documentType: documentType || "",
      leadDate: new Date(leadDate),
      stepCompleted: action === "continue" ? 1 : 0 // 0 means saved at step 1
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: action === "continue"
        ? "Lead created successfully, continue to next step"
        : "Lead saved as draft",
      lead,
      nextStep: action === "continue" ? 2 : null
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     CONTINUE TO NEXT STEP
// =========================
exports.continueToNextStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { stepNumber } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    lead.stepCompleted = Math.max(lead.stepCompleted, parseInt(stepNumber));
    await lead.save();

    res.json({
      success: true,
      message: `Continued to step ${stepNumber}`,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     UPDATE SPECIFIC STEP
// =========================
exports.updateStep = async (req, res) => {
  try {
    const { id, stepNumber } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    switch (parseInt(stepNumber)) {
      case 1:
        lead.customerName = stepData.customerName || lead.customerName;
        lead.mobileNumber = stepData.mobileNumber || lead.mobileNumber;
        lead.email = stepData.email || lead.email;
        lead.address = stepData.address || lead.address;
        lead.reference = stepData.reference || lead.reference;
        lead.agentName = stepData.agentName || lead.agentName;
        lead.firstAmount = stepData.firstAmount ? parseFloat(stepData.firstAmount) : lead.firstAmount;
        lead.documentType = stepData.documentType || lead.documentType;
        lead.leadDate = stepData.leadDate ? new Date(stepData.leadDate) : lead.leadDate;
        break;

      case 2:
        lead.partyType = stepData.partyType || lead.partyType;

        if (stepData.partyType === "buyer" || stepData.partyType === "both") {
          lead.buyer = {
            name: stepData.buyerName,
            phoneNumber: stepData.buyerPhone,
            address: stepData.buyerAddress,
            email: stepData.buyerEmail,
            aadhar: stepData.buyerAadhar,
            pan: stepData.buyerPan
          };
        }

        if (stepData.partyType === "seller" || stepData.partyType === "both") {
          lead.seller = {
            name: stepData.sellerName,
            phoneNumber: stepData.sellerPhone,
            address: stepData.sellerAddress,
            email: stepData.sellerEmail,
            aadhar: stepData.sellerAadhar,
            pan: stepData.sellerPan
          };
        }

        if (stepData.partyType === "individual") {
          lead.individual = {
            name: stepData.individualName,
            phoneNumber: stepData.individualPhone,
            address: stepData.individualAddress,
            email: stepData.individualEmail,
            aadhar: stepData.individualAadhar,
            pan: stepData.individualPan
          };
        }
        break;

      case 3:
        lead.propertyLocation = stepData.propertyLocation || lead.propertyLocation;
        lead.documentNumber = stepData.documentNumber || lead.documentNumber;
        lead.documentStartingDate = stepData.documentStartingDate
          ? new Date(stepData.documentStartingDate)
          : lead.documentStartingDate;
        lead.documentStatus = stepData.documentStatus || lead.documentStatus;
        break;

      case 4:
        lead.stampDuty = stepData.stampDuty ? parseFloat(stepData.stampDuty) : lead.stampDuty;
        lead.registrationFee = stepData.registrationFee ? parseFloat(stepData.registrationFee) : lead.registrationFee;
        lead.mutationFee = stepData.mutationFee ? parseFloat(stepData.mutationFee) : lead.mutationFee;
        lead.officeFee = stepData.officeFee ? parseFloat(stepData.officeFee) : lead.officeFee;
        break;

      case 5:
        lead.completionDate = stepData.completionDate
          ? new Date(stepData.completionDate)
          : lead.completionDate;
        lead.successStatus = stepData.successStatus || lead.successStatus;
        lead.finalRemarks = stepData.finalRemarks || lead.finalRemarks;
        lead.leadStatus = "completed";
        break;
    }

    lead.stepCompleted = Math.max(lead.stepCompleted, parseInt(stepNumber));
    await lead.save();

    res.json({
      success: true,
      message: `Step ${stepNumber} updated successfully`,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     ADD LOAN FACILITY
// =========================
exports.addLoanFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      aadharNumber,
      phoneNumber,
      loanAmount,
      extraFee,
      loanDate,
      givenOrPendingDate
    } = req.body;

    console.log("Request files:", req.files);
    console.log("Request body:", req.body);

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    let documentUploads = [];
    if (req.files && req.files.length > 0) {
      documentUploads = req.files.map(file => ({
        fileName: file.originalname,
        filePath: `/uploads/${file.filename}`,
        fileSize: file.size,
        mimeType: file.mimetype
      }));
    }

    lead.loanFacility = {
      isActive: true,
      clientName,
      aadharNumber,
      phoneNumber,
      documentUploads,
      loanAmount: parseFloat(loanAmount),
      extraFee: parseFloat(extraFee),
      loanDate: new Date(loanDate),
      givenOrPendingDate: givenOrPendingDate ? new Date(givenOrPendingDate) : null
    };

    await lead.save();

    res.json({
      success: true,
      message: "Loan facility added successfully",
      lead
    });
  } catch (err) {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.path) deleteFile(file.path);
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     UPLOAD DOCUMENTS
// =========================
exports.uploadDocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded"
      });
    }

    const lead = await Lead.findById(id);
    if (!lead) {
      req.files.forEach(file => deleteFile(file.path));
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const newDocuments = req.files.map(file => ({
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`
    }));

    lead.documentUploads = [...(lead.documentUploads || []), ...newDocuments];
    await lead.save();

    res.json({
      success: true,
      message: "Documents uploaded successfully",
      documents: newDocuments,
      lead
    });
  } catch (err) {
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => deleteFile(file.path));
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     ADD PAYMENT TRANSACTION
// =========================
exports.addPaymentTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount, mode, purpose, remarks, type } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const transaction = {
      date: new Date(date),
      amount: parseFloat(amount),
      mode,
      purpose: purpose || "Payment",
      remarks: remarks || ""
    };

    if (type === "paid") {
      lead.paidTransactions.push(transaction);
    } else if (type === "pending") {
      lead.pendingTransactions.push(transaction);
    } else {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be 'paid' or 'pending'"
      });
    }

    await lead.save();

    res.json({
      success: true,
      message: `${type} transaction added successfully`,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     ADD COMMISSION
// =========================
exports.addCommission = async (req, res) => {
  try {
    const { id, type } = req.params;
    const { date, amount, mode, remarks } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const commission = {
      date: new Date(date),
      amount: parseFloat(amount),
      mode,
      remarks: remarks || ""
    };

    if (type === "registrar") {
      lead.registrarCommission.push(commission);
    } else if (type === "agent") {
      lead.agentCommission.push(commission);
    } else {
      return res.status(400).json({
        success: false,
        message: "Commission type must be 'registrar' or 'agent'"
      });
    }

    await lead.save();

    res.json({
      success: true,
      message: `${type} commission added successfully`,
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE COMMISSION
// =========================
exports.deleteCommission = async (req, res) => {
  try {
    const { id, type, commissionId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    let commissionArray;
    if (type === "registrar") {
      commissionArray = lead.registrarCommission;
    } else if (type === "agent") {
      commissionArray = lead.agentCommission;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid commission type"
      });
    }

    const index = commissionArray.findIndex(
      comm => comm._id.toString() === commissionId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Commission not found"
      });
    }

    commissionArray.splice(index, 1);
    await lead.save();

    res.json({
      success: true,
      message: "Commission deleted successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     ADD OTHER FEE
// =========================
exports.addOtherFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const otherFee = {
      description,
      amount: parseFloat(amount)
    };

    lead.otherFees.push(otherFee);
    await lead.save();

    res.json({
      success: true,
      message: "Other fee added successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE OTHER FEE
// =========================
exports.deleteOtherFee = async (req, res) => {
  try {
    const { id, feeId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const index = lead.otherFees.findIndex(
      fee => fee._id.toString() === feeId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Fee not found"
      });
    }

    lead.otherFees.splice(index, 1);
    await lead.save();

    res.json({
      success: true,
      message: "Other fee deleted successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     COMPLETE LEAD
// =========================
exports.completeLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { completionDate, successStatus, finalRemarks } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    lead.completionDate = completionDate ? new Date(completionDate) : new Date();
    lead.successStatus = successStatus || "Successful";
    lead.finalRemarks = finalRemarks || "";
    lead.leadStatus = "completed";
    lead.stepCompleted = 5;

    await lead.save();

    res.json({
      success: true,
      message: "Lead marked as completed",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     SAVE LEAD (AS DRAFT)
// =========================
exports.saveLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStep } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    lead.stepCompleted = parseInt(currentStep) || lead.stepCompleted;
    await lead.save();

    res.json({
      success: true,
      message: "Lead saved as draft",
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status;

    let query = { deletedAt: null };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { documentNumber: { $regex: search, $options: "i" } },
        { "buyer.name": { $regex: search, $options: "i" } },
        { "seller.name": { $regex: search, $options: "i" } }
      ];
    }

    if (status) {
      query.leadStatus = status;
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET LEAD BY ID
// =========================
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      deletedAt: null
    });

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({ success: true, lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE LEAD (SOFT DELETE)
// =========================
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    await lead.softDelete();

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET LEADS BY STATUS
// =========================
exports.getLeadsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      deletedAt: null,
      leadStatus: status
    };

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET LEAD STATISTICS
// =========================
exports.getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ deletedAt: null });
    const newLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "New" });
    const inProgressLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "In Progress" });
    const completedLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "completed" });

    const revenueResult = await Lead.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        inProgressLeads,
        completedLeads,
        totalRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
