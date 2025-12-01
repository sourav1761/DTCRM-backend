const express = require("express");
const router = express.Router();
const paymentsCtrl = require("../controllers/paymentController");

router.get("/", paymentsCtrl.getPayments);
router.get("/summary", paymentsCtrl.getPaymentsSummary);
router.put("/:id", paymentsCtrl.updatePayment);

module.exports = router;
