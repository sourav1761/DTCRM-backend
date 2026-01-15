const PaymentHistory = require("../models/PaymentHistory");

// =======================
// CREATE PAYMENT
// =======================
exports.createPayment = async (req, res) => {
  try {
    const {
      name,
      amount,
      paymentMode,
      purpose,
      date,
      status,
      remark,
    } = req.body;

    if (!name || !amount || !paymentMode || !purpose || !date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const payment = await PaymentHistory.create({
      name,
      amount,
      paymentMode,
      purpose,
      date,
      status,
      remark,
    });

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET ALL PAYMENTS
// =======================
exports.getPayments = async (req, res) => {
  try {
    const payments = await PaymentHistory.find().sort({ date: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET SINGLE PAYMENT
// =======================
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await PaymentHistory.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// UPDATE PAYMENT (ADMIN)
// =======================
exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await PaymentHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// DELETE PAYMENT (ADMIN)
// =======================
exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await PaymentHistory.findByIdAndDelete(
      req.params.id
    );

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
