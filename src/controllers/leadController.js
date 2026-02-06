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

// Step 1 - Create Lead
exports.createLeadStep1 = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log
    
    const {
      customerName,
      mobileNumber,
      email,
      address,
      sourceOfEntry = "direct",
      referenceName,
      declarationAmount,
      documentType,
      leadStatus = "New",
      date,
      action // "save" or "continue"
    } = req.body;

    console.log('Extracted values:', { customerName, mobileNumber, date }); // Debug log

    if (!customerName || !mobileNumber || !date) {
      return res.status(400).json({
        success: false,
        message: "Customer name, mobile number, and date are required"
      });
    }

    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    const leadData = {
      customerName,
      mobileNumber,
      email: email || "",
      address: address || "",
      sourceOfEntry,
      referenceName: sourceOfEntry === "reference" ? referenceName : "",
      declarationAmount: declarationAmount ? parseFloat(declarationAmount) : 0,
      documentType: documentType || "",
      leadStatus,
      date: parsedDate,
      stepCompleted: action === "continue" ? 1 : 1,
      isDraft: action === "save" ? true : false
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: action === "continue" 
        ? "Lead created successfully, continue to next step" 
        : "Lead saved successfully",
      lead,
      nextStep: action === "continue" ? 2 : null
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false, 
        message: errors.join(', ') 
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists"
      });
    }
    
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Step 1
exports.updateStep1 = async (req, res) => {
  try {
    const { id } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (stepData.customerName !== undefined) lead.customerName = stepData.customerName;
    if (stepData.mobileNumber !== undefined) lead.mobileNumber = stepData.mobileNumber;
    if (stepData.email !== undefined) lead.email = stepData.email;
    if (stepData.address !== undefined) lead.address = stepData.address;
    if (stepData.sourceOfEntry !== undefined) lead.sourceOfEntry = stepData.sourceOfEntry;
    if (stepData.referenceName !== undefined) lead.referenceName = stepData.referenceName;
    if (stepData.declarationAmount !== undefined) lead.declarationAmount = parseFloat(stepData.declarationAmount) || 0;
    if (stepData.documentType !== undefined) lead.documentType = stepData.documentType;
    if (stepData.leadStatus !== undefined) lead.leadStatus = stepData.leadStatus;
    if (stepData.date !== undefined) lead.date = new Date(stepData.date);

    await lead.save();

    res.json({
      success: true,
      message: "Step 1 updated successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Step 2
exports.updateStep2 = async (req, res) => {
  try {
    const { id } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (stepData.buyers !== undefined) lead.buyers = stepData.buyers;
    if (stepData.sellers !== undefined) lead.sellers = stepData.sellers;
    if (stepData.individual !== undefined) lead.individual = stepData.individual;
    if (stepData.documentTypeOption !== undefined) lead.documentTypeOption = stepData.documentTypeOption;
    if (stepData.ownerName !== undefined) lead.ownerName = stepData.ownerName;
    if (stepData.bankName !== undefined) lead.bankName = stepData.bankName;

    lead.stepCompleted = Math.max(lead.stepCompleted, 2);
    if (lead.isDraft) {
      lead.isDraft = false;
      lead.leadStatus = "In Progress";
    }

    await lead.save();

    res.json({
      success: true,
      message: "Step 2 updated successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Step 3
exports.updateStep3 = async (req, res) => {
  try {
    const { id } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (stepData.propertyLocation !== undefined) lead.propertyLocation = stepData.propertyLocation;
    if (stepData.documentNumber !== undefined) lead.documentNumber = stepData.documentNumber;
    if (stepData.documentStartingDate !== undefined) lead.documentStartingDate = new Date(stepData.documentStartingDate);
    if (stepData.documentStatus !== undefined) lead.documentStatus = stepData.documentStatus;

    lead.stepCompleted = Math.max(lead.stepCompleted, 3);
    if (lead.isDraft) {
      lead.isDraft = false;
      lead.leadStatus = "In Progress";
    }

    await lead.save();

    res.json({
      success: true,
      message: "Step 3 updated successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Upload Documents
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
      filePath: `/uploads/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype
    }));

    lead.leadDocuments = [...(lead.leadDocuments || []), ...newDocuments];
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

// Delete Document
exports.deleteDocument = async (req, res) => {
  try {
    const { id, docId } = req.params;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    const documentIndex = lead.leadDocuments.findIndex(doc => doc._id.toString() === docId);
    if (documentIndex === -1) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const filePath = lead.leadDocuments[documentIndex].filePath;
    deleteFile(filePath);

    lead.leadDocuments.splice(documentIndex, 1);
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

// Update Step 4
exports.updateStep4 = async (req, res) => {
  try {
    const { id } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (stepData.stampDuty !== undefined) lead.stampDuty = parseFloat(stepData.stampDuty) || 0;
    if (stepData.registrationFee !== undefined) lead.registrationFee = parseFloat(stepData.registrationFee) || 0;
    if (stepData.mutationFee !== undefined) lead.mutationFee = parseFloat(stepData.mutationFee) || 0;
    if (stepData.otherFees !== undefined) lead.otherFees = stepData.otherFees;
    if (stepData.officeFee !== undefined) lead.officeFee = parseFloat(stepData.officeFee) || 0;
    if (stepData.registrarCommission !== undefined) lead.registrarCommission = stepData.registrarCommission;
    if (stepData.agentCommission !== undefined) lead.agentCommission = stepData.agentCommission;
    if (stepData.paidAmount !== undefined) lead.paidAmount = stepData.paidAmount;
    if (stepData.pendingAmount !== undefined) lead.pendingAmount = stepData.pendingAmount;

    lead.stepCompleted = Math.max(lead.stepCompleted, 4);
    if (lead.isDraft) {
      lead.isDraft = false;
      lead.leadStatus = "In Progress";
    }

    await lead.save();

    res.json({
      success: true,
      message: "Step 4 updated successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Step 5
exports.updateStep5 = async (req, res) => {
  try {
    const { id } = req.params;
    const stepData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (stepData.completionDate !== undefined) lead.completionDate = stepData.completionDate ? new Date(stepData.completionDate) : null;
    if (stepData.successStatus !== undefined) lead.successStatus = stepData.successStatus;
    if (stepData.remark !== undefined) lead.remark = stepData.remark;

    lead.stepCompleted = 5;
    lead.leadStatus = "Completed";

    await lead.save();

    res.json({
      success: true,
      message: "Lead completed successfully",
      lead
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get All Leads
exports.getAllLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status;
    const step = req.query.step;

    let query = { deletedAt: null };

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { leadId: { $regex: search, $options: "i" } }
      ];
    }

    if (status) query.leadStatus = status;
    if (step) query.stepCompleted = parseInt(step);

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

// Get Lead by ID
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

// Update Lead (General)
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

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

// Delete Lead (Soft Delete)
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

// Hard Delete Lead
exports.hardDeleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    if (lead.leadDocuments && lead.leadDocuments.length > 0) {
      lead.leadDocuments.forEach(doc => {
        deleteFile(doc.filePath);
      });
    }

    await lead.deleteOne();

    res.json({ success: true, message: "Lead permanently deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Lead Statistics
exports.getLeadStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments({ deletedAt: null });
    const newLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "New" });
    const inProgressLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "In Progress" });
    const completedLeads = await Lead.countDocuments({ deletedAt: null, leadStatus: "Completed" });

    const stats = {
      totalLeads,
      newLeads,
      inProgressLeads,
      completedLeads
    };

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