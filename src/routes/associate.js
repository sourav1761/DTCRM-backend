// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/associateController");

// // Associate
// router.post("/", ctrl.addAssociate);
// router.get("/", ctrl.getAssociates);

// // Payments
// router.post("/payment", ctrl.addPayment);
// router.get("/payment", ctrl.getPayments);
// router.get("/payment/:name", ctrl.getPaymentsByAssociate);


// module.exports = router;






const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/associateController");

// Associate
router.post("/", ctrl.addAssociate);
router.get("/", ctrl.getAssociates);

// Fee Settlement / Payments
router.post("/payment", ctrl.addPayment);
router.get("/payment", ctrl.getPayments);
router.get("/payment/:name", ctrl.getPaymentsByAssociate);

module.exports = router;
