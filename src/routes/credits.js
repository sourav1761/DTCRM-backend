const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addLoanEntry,
  getRecentCreditsLoans,
  addCredit
} = require("../controllers/creditController");

const upload = multer({
  dest: path.join(__dirname, "..", "uploads") // FIXED
});

// credit entry (account)
router.post("/credit", addCredit);

// loan entry (agreements upload)
router.post("/loan", upload.array("agreements", 5), addLoanEntry);

// recent entries
router.get("/recent", getRecentCreditsLoans);

module.exports = router;
