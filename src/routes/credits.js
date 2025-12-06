
// const express = require("express");
// const router = express.Router();

// const upload = require("../src/middleware/uploadMiddleware");

// const {
//   addLoanEntry,
//   getRecentCreditsLoans,
//   addCredit,
//   getCreditHistory,
//   updateLoanEntry
// } = require("../src/controllers/creditController");

// // ACCOUNT CREDIT ENTRY
// router.post("/credit", addCredit);

// // CREATE LOAN ENTRY
// router.post("/loan", upload.array("agreements", 5), addLoanEntry);

// // UPDATE LOAN ENTRY (same ID)
// router.patch("/loan/:id", upload.array("agreements", 5), updateLoanEntry);

// // LIST
// router.get("/recent", getRecentCreditsLoans);
// router.get("/history", getCreditHistory);

// module.exports = router;


const express = require("express");
const router = express.Router();

// RIGHT PATH
const upload = require("../middleware/uploadMiddleware");

const {
  addLoanEntry,
  getRecentCreditsLoans,
  addCredit,
  getCreditHistory,
  updateLoanEntry
} = require("../controllers/creditController");

// ACCOUNT CREDIT ENTRY
router.post("/credit", addCredit);

// ADD LOAN ENTRY
router.post("/loan", upload.array("agreements", 5), addLoanEntry);

// UPDATE LOAN ENTRY
router.patch("/loan/:id", upload.array("agreements", 5), updateLoanEntry);

// LIST
router.get("/recent", getRecentCreditsLoans);

// CREDIT HISTORY
router.get("/history", getCreditHistory);

module.exports = router;
