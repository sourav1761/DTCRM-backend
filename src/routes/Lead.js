// const express = require("express");
// const router = express.Router();
// const leadController = require("../controllers/leadController");
// const { uploadMultiple } = require("../middleware/uploadMiddleware");

// // IMPORTANT: ORDER MATTERS
// router.get("/stats/overview", leadController.getLeadStats);
// router.get("/status/:status", leadController.getLeadsByStatus);

// router.post("/", leadController.createLeadStep1);
// router.get("/", leadController.getLeads);

// router.get("/:id", leadController.getLeadById);
// router.delete("/:id", leadController.deleteLead);

// router.post("/:id/continue-step", leadController.continueToNextStep);
// router.put("/:id/step/:stepNumber", leadController.updateStep);

// router.post("/:id/loan-facility", uploadMultiple, leadController.addLoanFacility);
// router.post("/:id/documents", uploadMultiple, leadController.uploadDocuments);

// router.post("/:id/payments", leadController.addPaymentTransaction);
// router.post("/:id/commission/:type", leadController.addCommission);
// router.delete("/:id/commission/:type/:commissionId", leadController.deleteCommission);

// router.post("/:id/other-fee", leadController.addOtherFee);
// router.delete("/:id/other-fee/:feeId", leadController.deleteOtherFee);

// router.post("/:id/complete", leadController.completeLead);
// router.post("/:id/save", leadController.saveLead);

// module.exports = router;


const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { uploadMultiple } = require("../middleware/uploadMiddleware");



console.log("🔥 Lead routes loaded, uploadMultiple type:", typeof uploadMultiple);
// ⚠️ ORDER MATTERS
router.get("/stats/overview", leadController.getLeadStats);
router.get("/status/:status", leadController.getLeadsByStatus);

// CREATE
router.post("/", leadController.createLeadStep1);

// READ
router.get("/", leadController.getLeads);
router.get("/:id", leadController.getLeadById);

// UPDATE
router.post("/:id/continue-step", leadController.continueToNextStep);
router.put("/:id/step/:stepNumber", leadController.updateStep);

// FILE UPLOADS ✅ (FIXED)
router.post("/:id/loan-facility", uploadMultiple, leadController.addLoanFacility);
router.post("/:id/documents", uploadMultiple, leadController.uploadDocuments);

// PAYMENTS & FEES
router.post("/:id/payments", leadController.addPaymentTransaction);
router.post("/:id/commission/:type", leadController.addCommission);
router.delete("/:id/commission/:type/:commissionId", leadController.deleteCommission);
router.post("/:id/other-fee", leadController.addOtherFee);
router.delete("/:id/other-fee/:feeId", leadController.deleteOtherFee);

// COMPLETE / DELETE
router.post("/:id/complete", leadController.completeLead);
router.post("/:id/save", leadController.saveLead);
router.delete("/:id", leadController.deleteLead);

module.exports = router;
