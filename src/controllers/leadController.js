

// const Lead = require("../models/Lead");
// const fs = require("fs");
// const path = require("path");

// // Helper function to delete files
// const deleteFile = (filePath) => {
//   const fullPath = path.join(__dirname, "..", "..", filePath);
//   if (fs.existsSync(fullPath)) {
//     fs.unlinkSync(fullPath);
//   }
// };

// // =========================
// //     CREATE LEAD STEP 1
// // =========================
// exports.createLeadStep1 = async (req, res) => {
//   try {
//     const {
//       customerName,
//       mobileNumber,
//       email,
//       address,
//       reference,
//       agentName,
//       firstAmount,
//       documentType,
//       leadDate,
//       action // "save" or "continue"
//     } = req.body;

//     // Validate required fields
//     if (!customerName || !mobileNumber || !leadDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Customer name, mobile number, and lead date are required"
//       });
//     }

//     const leadData = {
//       customerName,
//       mobileNumber,
//       email: email || "",
//       address: address || "",
//       reference: reference || "direct",
//       agentName: reference === "agent" ? agentName : "",
//       firstAmount: firstAmount ? parseFloat(firstAmount) : 0,
//       documentType: documentType || "",
//       leadDate: new Date(leadDate),
//       stepCompleted: action === "continue" ? 1 : 0 // 0 means saved at step 1
//     };

//     const lead = await Lead.create(leadData);

//     res.status(201).json({
//       success: true,
//       message: action === "continue"
//         ? "Lead created successfully, continue to next step"
//         : "Lead saved as draft",
//       lead,
//       nextStep: action === "continue" ? 2 : null
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     CONTINUE TO NEXT STEP
// // =========================
// exports.continueToNextStep = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { stepNumber } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     lead.stepCompleted = Math.max(lead.stepCompleted, parseInt(stepNumber));
//     await lead.save();

//     res.json({
//       success: true,
//       message: `Continued to step ${stepNumber}`,
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     UPDATE SPECIFIC STEP
// // =========================
// exports.updateStep = async (req, res) => {
//   try {
//     const { id, stepNumber } = req.params;
//     const stepData = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     switch (parseInt(stepNumber)) {
//       case 1:
//         lead.customerName = stepData.customerName || lead.customerName;
//         lead.mobileNumber = stepData.mobileNumber || lead.mobileNumber;
//         lead.email = stepData.email || lead.email;
//         lead.address = stepData.address || lead.address;
//         lead.reference = stepData.reference || lead.reference;
//         lead.agentName = stepData.agentName || lead.agentName;
//         lead.firstAmount = stepData.firstAmount ? parseFloat(stepData.firstAmount) : lead.firstAmount;
//         lead.documentType = stepData.documentType || lead.documentType;
//         lead.leadDate = stepData.leadDate ? new Date(stepData.leadDate) : lead.leadDate;
//         break;

//       case 2:
//         lead.partyType = stepData.partyType || lead.partyType;

//         if (stepData.partyType === "buyer" || stepData.partyType === "both") {
//           lead.buyer = {
//             name: stepData.buyerName,
//             phoneNumber: stepData.buyerPhone,
//             address: stepData.buyerAddress,
//             email: stepData.buyerEmail,
//             aadhar: stepData.buyerAadhar,
//             pan: stepData.buyerPan
//           };
//         }

//         if (stepData.partyType === "seller" || stepData.partyType === "both") {
//           lead.seller = {
//             name: stepData.sellerName,
//             phoneNumber: stepData.sellerPhone,
//             address: stepData.sellerAddress,
//             email: stepData.sellerEmail,
//             aadhar: stepData.sellerAadhar,
//             pan: stepData.sellerPan
//           };
//         }

//         if (stepData.partyType === "individual") {
//           lead.individual = {
//             name: stepData.individualName,
//             phoneNumber: stepData.individualPhone,
//             address: stepData.individualAddress,
//             email: stepData.individualEmail,
//             aadhar: stepData.individualAadhar,
//             pan: stepData.individualPan
//           };
//         }
//         break;

//       case 3:
//         lead.propertyLocation = stepData.propertyLocation || lead.propertyLocation;
//         lead.documentNumber = stepData.documentNumber || lead.documentNumber;
//         lead.documentStartingDate = stepData.documentStartingDate
//           ? new Date(stepData.documentStartingDate)
//           : lead.documentStartingDate;
//         lead.documentStatus = stepData.documentStatus || lead.documentStatus;
//         break;

//       case 4:
//         lead.stampDuty = stepData.stampDuty ? parseFloat(stepData.stampDuty) : lead.stampDuty;
//         lead.registrationFee = stepData.registrationFee ? parseFloat(stepData.registrationFee) : lead.registrationFee;
//         lead.mutationFee = stepData.mutationFee ? parseFloat(stepData.mutationFee) : lead.mutationFee;
//         lead.officeFee = stepData.officeFee ? parseFloat(stepData.officeFee) : lead.officeFee;
//         break;

//       case 5:
//         lead.completionDate = stepData.completionDate
//           ? new Date(stepData.completionDate)
//           : lead.completionDate;
//         lead.successStatus = stepData.successStatus || lead.successStatus;
//         lead.finalRemarks = stepData.finalRemarks || lead.finalRemarks;
//         lead.leadStatus = "completed";
//         break;
//     }

//     lead.stepCompleted = Math.max(lead.stepCompleted, parseInt(stepNumber));
//     await lead.save();

//     res.json({
//       success: true,
//       message: `Step ${stepNumber} updated successfully`,
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     ADD LOAN FACILITY
// // =========================
// exports.addLoanFacility = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       clientName,
//       aadharNumber,
//       phoneNumber,
//       loanAmount,
//       extraFee,
//       loanDate,
//       givenOrPendingDate
//     } = req.body;

//     console.log("Request files:", req.files);
//     console.log("Request body:", req.body);

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     let documentUploads = [];
//     if (req.files && req.files.length > 0) {
//       documentUploads = req.files.map(file => ({
//         fileName: file.originalname,
//         filePath: `/uploads/${file.filename}`,
//         fileSize: file.size,
//         mimeType: file.mimetype
//       }));
//     }

//     lead.loanFacility = {
//       isActive: true,
//       clientName,
//       aadharNumber,
//       phoneNumber,
//       documentUploads,
//       loanAmount: parseFloat(loanAmount),
//       extraFee: parseFloat(extraFee),
//       loanDate: new Date(loanDate),
//       givenOrPendingDate: givenOrPendingDate ? new Date(givenOrPendingDate) : null
//     };

//     await lead.save();

//     res.json({
//       success: true,
//       message: "Loan facility added successfully",
//       lead
//     });
//   } catch (err) {
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => {
//         if (file.path) deleteFile(file.path);
//       });
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     UPLOAD DOCUMENTS
// // =========================
// exports.uploadDocuments = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No files uploaded"
//       });
//     }

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       req.files.forEach(file => deleteFile(file.path));
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     const newDocuments = req.files.map(file => ({
//       fileName: file.originalname,
//       filePath: `/uploads/${file.filename}`
//     }));

//     lead.documentUploads = [...(lead.documentUploads || []), ...newDocuments];
//     await lead.save();

//     res.json({
//       success: true,
//       message: "Documents uploaded successfully",
//       documents: newDocuments,
//       lead
//     });
//   } catch (err) {
//     if (req.files && req.files.length > 0) {
//       req.files.forEach(file => deleteFile(file.path));
//     }
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     ADD PAYMENT TRANSACTION
// // =========================
// exports.addPaymentTransaction = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, amount, mode, purpose, remarks, type } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     const transaction = {
//       date: new Date(date),
//       amount: parseFloat(amount),
//       mode,
//       purpose: purpose || "Payment",
//       remarks: remarks || ""
//     };

//     if (type === "paid") {
//       lead.paidTransactions.push(transaction);
//     } else if (type === "pending") {
//       lead.pendingTransactions.push(transaction);
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Transaction type must be 'paid' or 'pending'"
//       });
//     }

//     await lead.save();

//     res.json({
//       success: true,
//       message: `${type} transaction added successfully`,
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     ADD COMMISSION
// // =========================
// exports.addCommission = async (req, res) => {
//   try {
//     const { id, type } = req.params;
//     const { date, amount, mode, remarks } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     const commission = {
//       date: new Date(date),
//       amount: parseFloat(amount),
//       mode,
//       remarks: remarks || ""
//     };

//     if (type === "registrar") {
//       lead.registrarCommission.push(commission);
//     } else if (type === "agent") {
//       lead.agentCommission.push(commission);
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Commission type must be 'registrar' or 'agent'"
//       });
//     }

//     await lead.save();

//     res.json({
//       success: true,
//       message: `${type} commission added successfully`,
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     DELETE COMMISSION
// // =========================
// exports.deleteCommission = async (req, res) => {
//   try {
//     const { id, type, commissionId } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     let commissionArray;
//     if (type === "registrar") {
//       commissionArray = lead.registrarCommission;
//     } else if (type === "agent") {
//       commissionArray = lead.agentCommission;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid commission type"
//       });
//     }

//     const index = commissionArray.findIndex(
//       comm => comm._id.toString() === commissionId
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Commission not found"
//       });
//     }

//     commissionArray.splice(index, 1);
//     await lead.save();

//     res.json({
//       success: true,
//       message: "Commission deleted successfully",
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     ADD OTHER FEE
// // =========================
// exports.addOtherFee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description, amount } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     const otherFee = {
//       description,
//       amount: parseFloat(amount)
//     };

//     lead.otherFees.push(otherFee);
//     await lead.save();

//     res.json({
//       success: true,
//       message: "Other fee added successfully",
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     DELETE OTHER FEE
// // =========================
// exports.deleteOtherFee = async (req, res) => {
//   try {
//     const { id, feeId } = req.params;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     const index = lead.otherFees.findIndex(
//       fee => fee._id.toString() === feeId
//     );

//     if (index === -1) {
//       return res.status(404).json({
//         success: false,
//         message: "Fee not found"
//       });
//     }

//     lead.otherFees.splice(index, 1);
//     await lead.save();

//     res.json({
//       success: true,
//       message: "Other fee deleted successfully",
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     COMPLETE LEAD
// // =========================
// exports.completeLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { completionDate, successStatus, finalRemarks } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     lead.completionDate = completionDate ? new Date(completionDate) : new Date();
//     lead.successStatus = successStatus || "Successful";
//     lead.finalRemarks = finalRemarks || "";
//     lead.leadStatus = "completed";
//     lead.stepCompleted = 5;

//     await lead.save();

//     res.json({
//       success: true,
//       message: "Lead marked as completed",
//       lead
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     SAVE LEAD (AS DRAFT)
// // =========================
// exports.saveLead = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { currentStep } = req.body;

//     const lead = await Lead.findById(id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     lead.stepCompleted = parseInt(currentStep) || lead.stepCompleted;
//     await lead.save();

//     res.json({
//       success: true,
//       message: "Lead saved as draft",
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
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 50;
//     const skip = (page - 1) * limit;

//     const search = req.query.search || "";
//     const status = req.query.status;

//     let query = { deletedAt: null };

//     if (search) {
//       query.$or = [
//         { customerName: { $regex: search, $options: "i" } },
//         { mobileNumber: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { documentNumber: { $regex: search, $options: "i" } },
//         { "buyer.name": { $regex: search, $options: "i" } },
//         { "seller.name": { $regex: search, $options: "i" } }
//       ];
//     }

//     if (status) {
//       query.leadStatus = status;
//     }

//     const leads = await Lead.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Lead.countDocuments(query);

//     res.json({
//       success: true,
//       leads,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       limit
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     GET LEAD BY ID
// // =========================
// exports.getLeadById = async (req, res) => {
//   try {
//     const lead = await Lead.findOne({
//       _id: req.params.id,
//       deletedAt: null
//     });

//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     res.json({ success: true, lead });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     DELETE LEAD (SOFT DELETE)
// // =========================
// exports.deleteLead = async (req, res) => {
//   try {
//     const lead = await Lead.findById(req.params.id);
//     if (!lead) {
//       return res.status(404).json({ success: false, message: "Lead not found" });
//     }

//     await lead.softDelete();

//     res.json({ success: true, message: "Lead deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     GET LEADS BY STATUS
// // =========================
// exports.getLeadsByStatus = async (req, res) => {
//   try {
//     const { status } = req.params;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const skip = (page - 1) * limit;

//     const query = {
//       deletedAt: null,
//       leadStatus: status
//     };

//     const leads = await Lead.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     const total = await Lead.countDocuments(query);

//     res.json({
//       success: true,
//       leads,
//       total,
//       page,
//       totalPages: Math.ceil(total / limit)
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // =========================
// //     GET LEAD STATISTICS
// // =========================
// exports.getLeadStats = async (req, res) => {
//   try {
//     const totalLeads = await Lead.countDocuments({ deletedAt: null });
//     const newLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "New" });
//     const inProgressLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "In Progress" });
//     const completedLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "completed" });

//     const revenueResult = await Lead.aggregate([
//       { $match: { deletedAt: null } },
//       { $group: { _id: null, total: { $sum: "$totalAmount" } } }
//     ]);

//     const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

//     res.json({
//       success: true,
//       stats: {
//         totalLeads,
//         newLeads,
//         inProgressLeads,
//         completedLeads,
//         totalRevenue
//       }
//     });
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
      reference = "direct",
      agentName,
      declarationAmount,
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
      reference,
      agentName: reference === "associate" ? agentName : "",
      declarationAmount: declarationAmount ? parseFloat(declarationAmount) : 0,
      documentType: documentType || "",
      leadDate: new Date(leadDate),
      stepCompleted: action === "continue" ? 1 : 0,
      isDraft: action === "save" ? true : false,
      leadStatus: action === "save" ? "Draft" : "New"
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
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists"
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     SAVE AS DRAFT
// =========================
exports.saveAsDraft = async (req, res) => {
  try {
    const leadData = req.body;
    leadData.isDraft = true;
    leadData.leadStatus = "Draft";
    
    const lead = await Lead.create(leadData);
    
    res.status(201).json({
      success: true,
      message: "Lead saved as draft",
      lead
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
    if (lead.isDraft && stepNumber > 1) {
      lead.isDraft = false;
      lead.leadStatus = "In Progress";
    }
    
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
        lead.declarationAmount = stepData.declarationAmount ? parseFloat(stepData.declarationAmount) : lead.declarationAmount;
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

        lead.ownerName = stepData.ownerName || lead.ownerName;
        lead.bankName = stepData.bankName || lead.bankName;
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
        
        // Manual amounts from Step 4
        lead.manualTotalAmount = stepData.manualTotalAmount ? parseFloat(stepData.manualTotalAmount) : lead.manualTotalAmount;
        lead.manualPaidAmount = stepData.manualPaidAmount ? parseFloat(stepData.manualPaidAmount) : lead.manualPaidAmount;
        lead.manualPaidDate = stepData.manualPaidDate ? new Date(stepData.manualPaidDate) : lead.manualPaidDate;
        lead.manualPaymentMode = stepData.manualPaymentMode || lead.manualPaymentMode;
        lead.manualPaymentRemark = stepData.manualPaymentRemark || lead.manualPaymentRemark;
        lead.manualPendingAmount = stepData.manualPendingAmount ? parseFloat(stepData.manualPendingAmount) : lead.manualPendingAmount;
        lead.manualPendingDate = stepData.manualPendingDate ? new Date(stepData.manualPendingDate) : lead.manualPendingDate;
        lead.manualPendingRemark = stepData.manualPendingRemark || lead.manualPendingRemark;
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
    if (lead.isDraft && parseInt(stepNumber) > 1) {
      lead.isDraft = false;
      lead.leadStatus = "In Progress";
    }
    
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
//     UPDATE MANUAL AMOUNTS (Step 4)
// =========================
exports.updateManualAmounts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      manualTotalAmount,
      manualPaidAmount,
      manualPaidDate,
      manualPaymentMode,
      manualPaymentRemark,
      manualPendingAmount,
      manualPendingDate,
      manualPendingRemark
    } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    lead.manualTotalAmount = parseFloat(manualTotalAmount) || 0;
    lead.manualPaidAmount = parseFloat(manualPaidAmount) || 0;
    lead.manualPaidDate = manualPaidDate ? new Date(manualPaidDate) : null;
    lead.manualPaymentMode = manualPaymentMode || "";
    lead.manualPaymentRemark = manualPaymentRemark || "";
    lead.manualPendingAmount = parseFloat(manualPendingAmount) || 0;
    lead.manualPendingDate = manualPendingDate ? new Date(manualPendingDate) : null;
    lead.manualPendingRemark = manualPendingRemark || "";

    await lead.save();

    res.json({
      success: true,
      message: "Manual amounts updated successfully",
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
    const { documentType } = req.body;

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
      filePath: `/uploads/${file.filename}`,
      documentType: documentType || "General"
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
//     DELETE DOCUMENT
// =========================
exports.deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const documentIndex = lead.documentUploads.findIndex(doc => doc._id.toString() === docId);
    if (documentIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // Delete file from server
    const filePath = lead.documentUploads[documentIndex].filePath;
    deleteFile(filePath);

    // Remove from array
    lead.documentUploads.splice(documentIndex, 1);
    await lead.save();

    res.json({
      success: true,
      message: "Document deleted successfully",
      lead
    });
  } catch (err) {
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
//     UPDATE PAYMENT TRANSACTION
// =========================
exports.updatePaymentTransaction = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const updateData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Find and update in paid transactions
    let transaction = lead.paidTransactions.id(paymentId);
    let transactionType = "paid";
    
    if (!transaction) {
      transaction = lead.pendingTransactions.id(paymentId);
      transactionType = "pending";
    }

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    Object.keys(updateData).forEach(key => {
      if (key === "date") {
        transaction[key] = new Date(updateData[key]);
      } else if (key === "amount") {
        transaction[key] = parseFloat(updateData[key]);
      } else {
        transaction[key] = updateData[key];
      }
    });

    await lead.save();

    res.json({
      success: true,
      message: "Transaction updated successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DELETE PAYMENT TRANSACTION
// =========================
exports.deletePaymentTransaction = async (req, res) => {
  try {
    const { id, paymentId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Try to find in paid transactions
    let transactionIndex = lead.paidTransactions.findIndex(t => t._id.toString() === paymentId);
    if (transactionIndex !== -1) {
      lead.paidTransactions.splice(transactionIndex, 1);
    } else {
      // Try to find in pending transactions
      transactionIndex = lead.pendingTransactions.findIndex(t => t._id.toString() === paymentId);
      if (transactionIndex !== -1) {
        lead.pendingTransactions.splice(transactionIndex, 1);
      } else {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
    }

    await lead.save();

    res.json({
      success: true,
      message: "Transaction deleted successfully",
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
    const { date, amount, mode, remarks, status = "unpaid" } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const commission = {
      date: new Date(date),
      amount: parseFloat(amount),
      mode,
      remarks: remarks || "",
      status
    };

    if (type === "registrar") {
      lead.registrarCommission.push(commission);
    } else if (type === "agent") {
      // Add agent commission fields from your requirement
      const agentCommission = {
        ...commission,
        agentName: req.body.agentName,
        leadId: lead.leadId
      };
      lead.agentCommission.push(agentCommission);
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
//     UPDATE COMMISSION
// =========================
exports.updateCommission = async (req, res) => {
  try {
    const { id, type, commissionId } = req.params;
    const updateData = req.body;

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

    const commission = commissionArray.id(commissionId);
    if (!commission) {
      return res.status(404).json({ success: false, message: "Commission not found" });
    }

    Object.keys(updateData).forEach(key => {
      if (key === "date") {
        commission[key] = new Date(updateData[key]);
      } else if (key === "amount") {
        commission[key] = parseFloat(updateData[key]);
      } else {
        commission[key] = updateData[key];
      }
    });

    await lead.save();

    res.json({
      success: true,
      message: "Commission updated successfully",
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
    const { description, amount, date, status = "unpaid" } = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const otherFee = {
      description,
      amount: parseFloat(amount),
      date: date ? new Date(date) : new Date(),
      status
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
//     UPDATE OTHER FEE
// =========================
exports.updateOtherFee = async (req, res) => {
  try {
    const { id, feeId } = req.params;
    const updateData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const fee = lead.otherFees.id(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: "Fee not found" });
    }

    Object.keys(updateData).forEach(key => {
      if (key === "date") {
        fee[key] = new Date(updateData[key]);
      } else if (key === "amount") {
        fee[key] = parseFloat(updateData[key]);
      } else {
        fee[key] = updateData[key];
      }
    });

    await lead.save();

    res.json({
      success: true,
      message: "Other fee updated successfully",
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
    lead.successStatus = successStatus || "yes";
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
    lead.isDraft = true;
    lead.leadStatus = "Draft";
    
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
//     UPDATE LEAD (General)
// =========================
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow updating certain fields
    delete updateData._id;
    delete updateData.leadId;
    delete updateData.createdAt;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    res.json({
      success: true,
      message: "Lead updated successfully",
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
    const step = req.query.step;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    let query = { deletedAt: null };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { documentNumber: { $regex: search, $options: "i" } },
        { leadId: { $regex: search, $options: "i" } },
        { "buyer.name": { $regex: search, $options: "i" } },
        { "seller.name": { $regex: search, $options: "i" } },
        { "individual.name": { $regex: search, $options: "i" } }
      ];
    }

    if (status) {
      query.leadStatus = status;
    }

    if (step) {
      query.stepCompleted = parseInt(step);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-documentUploads.filePath -loanFacility.documentUploads.filePath');

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
//     GET LEAD BY CUSTOM ID
// =========================
exports.getLeadByCustomId = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Lead.findOne({
      leadId,
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
//     SEARCH LEADS
// =========================
exports.searchLeads = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters"
      });
    }

    const leads = await Lead.find({
      deletedAt: null,
      $or: [
        { customerName: { $regex: q, $options: "i" } },
        { mobileNumber: { $regex: q, $options: "i" } },
        { leadId: { $regex: q, $options: "i" } },
        { documentNumber: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }
      ]
    })
    .limit(10)
    .select('customerName mobileNumber leadId leadStatus stepCompleted createdAt');

    res.json({
      success: true,
      leads
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     GET RECENT LEADS
// =========================
exports.getRecentLeads = async (req, res) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    
    const leads = await Lead.find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('customerName mobileNumber leadId leadStatus stepCompleted createdAt');

    res.json({
      success: true,
      leads
    });
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
//     HARD DELETE LEAD
// =========================
exports.hardDeleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Delete uploaded files
    if (lead.documentUploads && lead.documentUploads.length > 0) {
      lead.documentUploads.forEach(doc => {
        deleteFile(doc.filePath);
      });
    }

    if (lead.loanFacility?.documentUploads && lead.loanFacility.documentUploads.length > 0) {
      lead.loanFacility.documentUploads.forEach(doc => {
        deleteFile(doc.filePath);
      });
    }

    await lead.deleteOne();

    res.json({ success: true, message: "Lead permanently deleted" });
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
//     UPDATE BULK STATUS
// =========================
exports.updateBulkStatus = async (req, res) => {
  try {
    const { leadIds, status } = req.body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Lead IDs array is required"
      });
    }

    const result = await Lead.updateMany(
      { _id: { $in: leadIds }, deletedAt: null },
      { $set: { leadStatus: status } }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} leads updated to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =========================
//     DUPLICATE LEAD
// =========================
exports.duplicateLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const originalLead = await Lead.findById(id);
    if (!originalLead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // Create a shallow copy and remove MongoDB _id
    const leadData = originalLead.toObject();
    delete leadData._id;
    delete leadData.leadId;
    delete leadData.createdAt;
    delete leadData.updatedAt;
    delete leadData.deletedAt;
    
    // Add "Copy" to customer name
    leadData.customerName = `${leadData.customerName} (Copy)`;
    leadData.leadStatus = "New";
    leadData.stepCompleted = 1;
    leadData.isDraft = true;

    const newLead = await Lead.create(leadData);

    res.json({
      success: true,
      message: "Lead duplicated successfully",
      lead: newLead
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
    const draftLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "Draft" });
    const inProgressLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "In Progress" });
    const completedLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "completed" });

    const revenueResult = await Lead.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: null, total: { $sum: "$totalAmount" }, paid: { $sum: "$paidAmount" }, pending: { $sum: "$pendingAmount" } } }
    ]);

    const stats = {
      totalLeads,
      newLeads,
      draftLeads,
      inProgressLeads,
      completedLeads,
      totalRevenue: revenueResult.length > 0 ? revenueResult[0].total : 0,
      paidRevenue: revenueResult.length > 0 ? revenueResult[0].paid : 0,
      pendingRevenue: revenueResult.length > 0 ? revenueResult[0].pending : 0
    };

    // Step-wise counts
    for (let i = 1; i <= 5; i++) {
      stats[`step${i}Leads`] = await Lead.countDocuments({ deletedAt: null, stepCompleted: i });
    }

    res.json({
      success: true,
      stats
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};