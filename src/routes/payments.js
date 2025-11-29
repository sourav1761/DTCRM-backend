const express = require("express");
const router = express.Router();
const paymentsCtrl = require("../controllers/paymentController");

router.get("/", paymentsCtrl.getPayments);
router.get("/summary", paymentsCtrl.getPaymentsSummary);

module.exports = router;
