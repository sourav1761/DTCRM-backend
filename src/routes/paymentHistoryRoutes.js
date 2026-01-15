const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentHistoryController");

// CREATE
router.post("/", paymentController.createPayment);

// READ
router.get("/", paymentController.getPayments);
router.get("/:id", paymentController.getPaymentById);

// ADMIN ACTIONS
router.put("/:id", paymentController.updatePayment);   // EDIT
router.delete("/:id", paymentController.deletePayment); // DELETE

module.exports = router;
