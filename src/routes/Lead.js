const express = require("express");
const router = express.Router();

const leadCtrl = require("../controllers/leadController");

router.post("/", leadCtrl.createLead);
router.get("/", leadCtrl.getLeads);
router.get("/:id", leadCtrl.getLeadById);
router.patch("/:id", leadCtrl.updateLead);
router.delete("/:id/fee", leadCtrl.deleteFeeTransaction); // NEW ROUTE
router.patch("/:id/case", leadCtrl.markCaseCompletion);

module.exports = router;