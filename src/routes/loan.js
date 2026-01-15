const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/loanController");
const { uploadLoanDocs } = require("../middleware/loanUpload.middleware");

console.log("🔥 Loan routes loaded");

router.post("/", uploadLoanDocs, ctrl.createLoan);
router.get("/", ctrl.getLoans);
router.get("/:id", ctrl.getLoanById);
router.delete("/:id", ctrl.deleteLoan);

module.exports = router;



// const express = require("express");
// const router = express.Router();

// console.log("🔥 Loan routes file loaded");

// router.post("/test", (req, res) => {
//   res.json({ success: true, message: "Loan API working" });
// });

// router.post("/", (req, res) => {
//   res.json({ success: true, message: "POST /api/loans working" });
// });

// module.exports = router;
