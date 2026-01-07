const router = require("express").Router();
const { upload, uploadMultiple } = require("../middleware/upload.middleware");
const ctrl = require("../controllers/lead.controller");

// STEP 1 — CREATE LEAD (JSON ONLY)
router.post("/", ctrl.createLead);

// UPDATE ANY STEP
router.patch("/:id", ctrl.updateLead);

// SINGLE DOCUMENT UPLOAD
router.post(
  "/:id/upload",
  upload.single("document"),
  ctrl.uploadDocument
);

// ✅ MULTIPLE DOCUMENT UPLOAD (FIXED)
router.post(
  "/:id/upload-multiple",
  uploadMultiple(),      // ✅ CALL IT
  ctrl.uploadDocument
);

router.get("/", ctrl.getLeads);
router.get("/:id", ctrl.getLead);
router.delete("/:id", ctrl.deleteLead);

module.exports = router;
