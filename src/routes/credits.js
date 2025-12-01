
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addLoanEntry,
  getRecentCreditsLoans,
  addCredit,
  getCreditHistory   // ✅ NEW
} = require("../controllers/creditController");

// File upload (loan agreement files)
const upload = multer({
  dest: path.join(__dirname, "..", "uploads")
});

// ACCOUNT CREDIT ENTRY

router.post("/credit", addCredit);

// LOAN ENTRY (with file upload)
router.post("/loan", upload.array("agreements", 5), addLoanEntry);

// RECENT CREDIT + LOAN ENTRIES
router.get("/recent", getRecentCreditsLoans);

// CREDIT HISTORY (NEW)
router.get("/history", getCreditHistory);

module.exports = router;
