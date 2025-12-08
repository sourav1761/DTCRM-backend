
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const leadCtrl = require("../controllers/leadController");

router.post("/", leadCtrl.createLead);
router.get("/", leadCtrl.getLeads);
router.get("/:id", leadCtrl.getLeadById);
router.patch("/:id", leadCtrl.updateLead);
// ⭐ NEW: Upload agreement route
router.post("/:id/upload-agreement", upload.single("agreement"), leadCtrl.uploadAgreement);
router.delete("/:id/fee", leadCtrl.deleteFeeTransaction);
router.patch("/:id/case", leadCtrl.markCaseCompletion);


router.patch("/:id/stationery/add", leadCtrl.addStationeryTransaction);
router.delete("/:id/stationery/delete", leadCtrl.deleteStationeryTransaction);


module.exports = router;