// const express = require("express");
// const router = express.Router();

// const leadCtrl = require("../controllers/leadController");

// router.post("/", leadCtrl.createLead);
// router.get("/", leadCtrl.getLeads);
// router.get("/:id", leadCtrl.getLeadById);
// router.patch("/:id", leadCtrl.updateLead);
// router.delete("/:id/fee", leadCtrl.deleteFeeTransaction); // NEW ROUTE
// router.patch("/:id/case", leadCtrl.markCaseCompletion);

// module.exports = router;


const express = require("express");
const router = express.Router();

const leadCtrl = require("../controllers/leadController");

router.post("/", leadCtrl.createLead);
router.get("/", leadCtrl.getLeads);
router.get("/:id", leadCtrl.getLeadById);
router.patch("/:id", leadCtrl.updateLead);
router.delete("/:id/fee", leadCtrl.deleteFeeTransaction);
router.patch("/:id/case", leadCtrl.markCaseCompletion);

// ⭐ NEW ROUTES
router.post("/:id/upload-agreement", leadCtrl.uploadAgreement);
router.delete("/:id/agreement", leadCtrl.deleteAgreement);
router.post("/:id/stationery", leadCtrl.addStationeryExpense);
router.delete("/:id/stationery", leadCtrl.deleteStationeryExpense);

module.exports = router;