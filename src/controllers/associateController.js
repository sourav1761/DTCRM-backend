



const Associate = require("../models/Associate");
const AssociatePayment = require("../models/AssociatePayment");
const mongoose = require("mongoose");

// =======================
// ADD ASSOCIATE
// =======================
exports.addAssociate = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      name,
      location,
      workplace,
      phoneNumber,
      email,
      joinDate,
      totalWork,
    } = req.body;

    if (!name || !phoneNumber || !joinDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const associate = await Associate.create({
      name,
      location,
      workplace,
      phoneNumber,
      email,
      joinDate,
      totalWork,
    });

    res.status(201).json({ success: true, associate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET ALL ASSOCIATES
// =======================
exports.getAssociates = async (req, res) => {
  try {
    const list = await Associate.find().sort({ createdAt: -1 });
    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET SINGLE ASSOCIATE BY ID
// =======================
exports.getAssociateById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid associate ID format",
      });
    }

    const associate = await Associate.findById(id);
    
    if (!associate) {
      return res.status(404).json({
        success: false,
        message: "Associate not found",
      });
    }

    res.json({ success: true, associate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// UPDATE ASSOCIATE
// =======================
exports.updateAssociate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid associate ID format",
      });
    }

    console.log("Updating associate ID:", id);
    console.log("Update data:", updatedData);

    // Validate required fields
    if (!updatedData.name || !updatedData.phoneNumber || !updatedData.joinDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (Name, Phone, Join Date)",
      });
    }

    const updatedAssociate = await Associate.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedAssociate) {
      return res.status(404).json({
        success: false,
        message: "Associate not found",
      });
    }

    res.json({
      success: true,
      message: "Associate updated successfully",
      associate: updatedAssociate,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// DELETE ASSOCIATE
// =======================
exports.deleteAssociate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid associate ID format",
      });
    }

    console.log("Deleting associate ID:", id);

    const deletedAssociate = await Associate.findByIdAndDelete(id);

    if (!deletedAssociate) {
      return res.status(404).json({
        success: false,
        message: "Associate not found",
      });
    }

    res.json({
      success: true,
      message: "Associate deleted successfully",
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// ADD PAYMENT (FEE SETTLEMENT)
// =======================
exports.addPayment = async (req, res) => {
  try {
    const { name, date, amount, paymentMode, remark } = req.body;

    if (!name || !date || !amount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    const payment = await AssociatePayment.create({
      name,
      date,
      amount,
      paymentMode,
      remark,
    });

    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET ALL PAYMENTS
// =======================
exports.getPayments = async (req, res) => {
  try {
    const list = await AssociatePayment.find().sort({ createdAt: -1 });
    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// GET PAYMENTS BY NAME
// =======================
exports.getPaymentsByAssociate = async (req, res) => {
  try {
    const { name } = req.params;

    const list = await AssociatePayment.find({ name }).sort({
      createdAt: -1,
    });

    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// =======================
// DELETE PAYMENT
// =======================
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID format",
      });
    }

    console.log("Deleting payment ID:", id);

    const deletedPayment = await AssociatePayment.findByIdAndDelete(id);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (err) {
    console.error("Delete payment error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};