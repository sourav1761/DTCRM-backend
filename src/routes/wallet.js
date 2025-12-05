// const express = require("express");
// const router = express.Router();
// const walletCtrl = require("../controllers/walletController");

// router.post("/deposit", walletCtrl.addDeposit);
// router.post("/withdraw", walletCtrl.addWithdraw);
// router.get("/balance", walletCtrl.getBalance);
// router.get("/recent", walletCtrl.getRecentTransactions);

// module.exports = router;



const express = require("express");
const router = express.Router();
const walletCtrl = require("../controllers/walletController");

router.post("/deposit", walletCtrl.addDeposit);
router.post("/withdraw", walletCtrl.addWithdraw);
router.get("/balance", walletCtrl.getBalance);
router.get("/recent", walletCtrl.getRecentTransactions);
router.get("/summary", walletCtrl.getWalletSummary); // ⭐ NEW ROUTE

module.exports = router;