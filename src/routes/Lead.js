const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { uploadMultiple } = require("../middleware/uploadMiddleware");

console.log("✅ Lead Routes Loaded");

// Statistics route (must be first)
router.get("/stats", leadController.getLeadStats);

// Create Lead Step 1
router.post("/", leadController.createLeadStep1);

// Get All Leads
router.get("/", leadController.getAllLeads);

// Get Lead by ID
router.get("/:id", leadController.getLeadById);

// Step Updates
router.put("/:id/step1", leadController.updateStep1);
router.patch("/:id/step1", leadController.updateStep1);

router.put("/:id/step2", leadController.updateStep2);
router.patch("/:id/step2", leadController.updateStep2);

router.put("/:id/step3", leadController.updateStep3);
router.patch("/:id/step3", leadController.updateStep3);

router.put("/:id/step4", leadController.updateStep4);
router.patch("/:id/step4", leadController.updateStep4);

router.put("/:id/step5", leadController.updateStep5);
router.patch("/:id/step5", leadController.updateStep5);

// Document Operations
router.post("/:id/documents", uploadMultiple(), leadController.uploadDocuments);
router.delete("/:id/documents/:docId", leadController.deleteDocument);

// General Update
router.put("/:id", leadController.updateLead);
router.patch("/:id", leadController.updateLead);

// Delete Operations
router.delete("/:id", leadController.deleteLead);
router.delete("/:id/hard", leadController.hardDeleteLead);

module.exports = router;