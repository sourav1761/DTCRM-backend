// const express = require("express");
// const router = express.Router();
// const walletCtrl = require("../controllers/walletController");

// router.post("/deposit", walletCtrl.addDeposit);
// router.post("/withdraw", walletCtrl.addWithdraw);
// router.get("/balance", walletCtrl.getBalance);
// router.get("/recent", walletCtrl.getRecentTransactions);
// router.get("/transactions/estimated_return", walletCtrl.getEstimatedReturnTransactions);



// module.exports = router;








const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/walletController");

console.log("🔥 Wallet routes loaded");

// TEST
router.post("/test", (req, res) => {
  res.json({ success: true, message: "Wallet API working" });
});

// Sampada Wallet
router.post("/sampada/add", ctrl.addSampadaAmount);
router.post("/sampada/stamp-duty/pay", ctrl.payStampDuty);

// Current Account
router.post("/deposit", ctrl.addDeposit);
router.post("/withdraw", ctrl.addWithdraw);

// Info
router.get("/balance", ctrl.getBalance);
router.get("/stamp-duty/history", ctrl.getStampDutyHistory);
router.post("/sync", ctrl.syncWallet);

// Transaction History
router.get("/deposits", ctrl.getDepositHistory);
router.get("/withdrawals", ctrl.getWithdrawalHistory);
router.get("/transactions", ctrl.getAllTransactions);
router.get("/transactions/deposits", ctrl.getDepositHistory);
router.get("/transactions/withdrawals", ctrl.getWithdrawalHistory);
router.get("/history/deposits", ctrl.getDepositHistory);
router.get("/history/withdrawals", ctrl.getWithdrawalHistory);

module.exports = router;
