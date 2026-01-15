// const Associate = require("../models/Associate");
// const AssociatePayment = require("../models/AssociatePayment");


// // =======================
// // ADD ASSOCIATE
// // =======================
// exports.addAssociate = async (req, res) => {
//   try {
//     const { name, workPlace, contact, location, joinDate, totalWorks } = req.body;

//     if (!name || !contact || !joinDate) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     const associate = await Associate.create({
//       name,
//       workPlace,
//       contact,
//       location,
//       joinDate,
//       totalWorks,
//     });

//     res.status(201).json({ success: true, associate });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // =======================
// // GET ALL ASSOCIATES
// // =======================
// exports.getAssociates = async (req, res) => {
//   try {
//     const list = await Associate.find().sort({ createdAt: -1 });
//     res.json({ success: true, list });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // =======================
// // ADD PAYMENT
// // =======================
// exports.addPayment = async (req, res) => {
//   try {
//     console.log("BODY RECEIVED:", req.body);

//     const {
//       associateName,
//       name, // 👈 allow this also
//       date,
//       amount,
//       paymentMode,
//       remark,
//       leadId,
//     } = req.body;

//     const finalName = associateName || name;

//     if (!finalName || !date || !amount) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     const payment = await AssociatePayment.create({
//       associateName: finalName,
//       date,
//       amount,
//       paymentMode,
//       remark,
//       leadId,
//     });

//     res.status(201).json({ success: true, payment });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// // =======================
// // GET PAYMENTS (ALL)
// // =======================
// exports.getPayments = async (req, res) => {
//   try {
//     const list = await AssociatePayment.find()
//       .populate("associate", "name contact")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, list });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // =======================
// // GET PAYMENTS BY ASSOCIATE
// // =======================
// exports.getPaymentsByAssociate = async (req, res) => {
//   try {
//     const { name } = req.params;

//     const list = await AssociatePayment.find({ associateName: name })
//       .sort({ createdAt: -1 });

//     res.json({ success: true, list });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };





const Associate = require("../models/Associate");
const AssociatePayment = require("../models/AssociatePayment");

// =======================
// ADD ASSOCIATE
// =======================





exports.addAssociate = async (req, res) => {
  try {
    console.log("BODY:", req.body); // 👈 ADD THIS

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
