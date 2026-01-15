

// const express = require("express");
// const router = express.Router();
// const leadController = require("../controllers/leadController");
// const { uploadMultiple } = require("../middleware/uploadMiddleware");

// console.log("✅ ACTIVE Lead Route Loaded:", __filename);

// // ⚠️ ORDER MATTERS — STATIC FIRST
// router.get("/stats/overview", leadController.getLeadStats);
// router.get("/status/:status", leadController.getLeadsByStatus);

// // =========================
// // CREATE
// // =========================
// router.post("/", leadController.createLeadStep1);

// // =========================
// // READ
// // =========================
// router.get("/", leadController.getLeads);
// router.get("/:id", leadController.getLeadById);

// // =========================
// // UPDATE STEPS
// // =========================
// router.post("/:id/continue-step", leadController.continueToNextStep);
// router.put("/:id/step/:stepNumber", leadController.updateStep);

// // =========================
// // FILE UPLOADS ✅ CORRECT WAY
// // =========================
// router.post("/:id/loan-facility", uploadMultiple(), leadController.addLoanFacility);
// router.post("/:id/documents", uploadMultiple(), leadController.uploadDocuments);

// // =========================
// // PAYMENTS & FEES
// // =========================
// router.post("/:id/payments", leadController.addPaymentTransaction);
// router.post("/:id/commission/:type", leadController.addCommission);
// router.delete("/:id/commission/:type/:commissionId", leadController.deleteCommission);
// router.post("/:id/other-fee", leadController.addOtherFee);
// router.delete("/:id/other-fee/:feeId", leadController.deleteOtherFee);

// // =========================
// // FINAL
// // =========================
// router.post("/:id/complete", leadController.completeLead);
// router.post("/:id/save", leadController.saveLead);
// router.delete("/:id", leadController.deleteLead);

// module.exports = router;






const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { uploadMultiple } = require("../middleware/uploadMiddleware");

console.log("✅ ACTIVE Lead Route Loaded:", __filename);

// ⚠️ ORDER MATTERS — STATIC FIRST
router.get("/stats/overview", leadController.getLeadStats);
router.get("/status/:status", leadController.getLeadsByStatus);
router.get("/search", leadController.searchLeads);
router.get("/recent/:limit", leadController.getRecentLeads);

// =========================
// CREATE
// =========================
router.post("/", leadController.createLeadStep1);
router.post("/draft", leadController.saveAsDraft);

// =========================
// READ
// =========================
router.get("/", leadController.getLeads);
router.get("/id/:leadId", leadController.getLeadByCustomId); // Get by custom lead ID
router.get("/:id", leadController.getLeadById);

// =========================
// UPDATE STEPS
// =========================
router.post("/:id/continue-step", leadController.continueToNextStep);
router.put("/:id/step/:stepNumber", leadController.updateStep);

// =========================
// BULK OPERATIONS
// =========================
router.put("/bulk-status", leadController.updateBulkStatus);
router.post("/:id/duplicate", leadController.duplicateLead);

// =========================
// FILE UPLOADS ✅ CORRECT WAY
// =========================
router.post("/:id/loan-facility", uploadMultiple(), leadController.addLoanFacility);
router.post("/:id/documents", uploadMultiple(), leadController.uploadDocuments);
router.delete("/:id/documents/:docId", leadController.deleteDocument);

// =========================
// PAYMENTS & FEES
// =========================
router.post("/:id/payments", leadController.addPaymentTransaction);
router.put("/:id/payments/:paymentId", leadController.updatePaymentTransaction);
router.delete("/:id/payments/:paymentId", leadController.deletePaymentTransaction);
router.post("/:id/commission/:type", leadController.addCommission);
router.put("/:id/commission/:type/:commissionId", leadController.updateCommission);
router.delete("/:id/commission/:type/:commissionId", leadController.deleteCommission);
router.post("/:id/other-fee", leadController.addOtherFee);
router.put("/:id/other-fee/:feeId", leadController.updateOtherFee);
router.delete("/:id/other-fee/:feeId", leadController.deleteOtherFee);

// =========================
// MANUAL AMOUNT UPDATES (Step 4 specific)
// =========================
router.put("/:id/manual-amounts", leadController.updateManualAmounts);

// =========================
// FINAL OPERATIONS
// =========================
router.put("/:id/complete", leadController.completeLead);
router.put("/:id/save-draft", leadController.saveLead);
router.put("/:id/update", leadController.updateLead); // General update
router.delete("/:id", leadController.deleteLead);
router.delete("/:id/hard", leadController.hardDeleteLead); // Permanent delete

module.exports = router;