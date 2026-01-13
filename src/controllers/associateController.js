const Associate = require("../models/Associate");
const AssociatePayment = require("../models/AssociatePayment");


// =======================
// ADD ASSOCIATE
// =======================
exports.addAssociate = async (req, res) => {
  try {
    const { name, workPlace, contact, location, joinDate, totalWorks } = req.body;

    if (!name || !contact || !joinDate) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const associate = await Associate.create({
      name,
      workPlace,
      contact,
      location,
      joinDate,
      totalWorks,
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
// ADD PAYMENT
// =======================
exports.addPayment = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const {
      associateName,
      name, // 👈 allow this also
      date,
      amount,
      paymentMode,
      remark,
      leadId,
    } = req.body;

    const finalName = associateName || name;

    if (!finalName || !date || !amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const payment = await AssociatePayment.create({
      associateName: finalName,
      date,
      amount,
      paymentMode,
      remark,
      leadId,
    });

    res.status(201).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// =======================
// GET PAYMENTS (ALL)
// =======================
exports.getPayments = async (req, res) => {
  try {
    const list = await AssociatePayment.find()
      .populate("associate", "name contact")
      .sort({ createdAt: -1 });

    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// =======================
// GET PAYMENTS BY ASSOCIATE
// =======================
exports.getPaymentsByAssociate = async (req, res) => {
  try {
    const { name } = req.params;

    const list = await AssociatePayment.find({ associateName: name })
      .sort({ createdAt: -1 });

    res.json({ success: true, list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
