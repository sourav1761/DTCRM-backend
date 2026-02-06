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






// const express = require("express");
// const router = express.Router();
// const ctrl = require("../controllers/associateController");

// // Associate
// router.post("/", ctrl.addAssociate);
// router.get("/", ctrl.getAssociates);
// router.put("/:id", ctrl.updateAssociate);     // ADD THIS
// router.delete("/:id", ctrl.deleteAssociate);

// // Fee Settlement / Payments
// router.post("/payment", ctrl.addPayment);
// router.get("/payment", ctrl.getPayments);
// router.get("/payment/:name", ctrl.getPaymentsByAssociate);
// router.delete("/payment/:id", ctrl.deletePayment);

// // // Update routes
// // router.put("/:id", ctrl.updateAssociate);
// // router.delete("/:id", ctrl.deleteAssociate);

// // Payment delete route
// router.delete("/payment/:id", ctrl.deletePayment);

// module.exports = router;































const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/associateController");

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.originalUrl}`);
  next();
});

// Fee Settlement / Payments Routes (MUST come before /:id routes)
router.post("/payment", ctrl.addPayment);            // CREATE PAYMENT - POST /api/associates/payment
router.get("/payment", ctrl.getPayments);            // READ ALL PAYMENTS - GET /api/associates/payment
router.get("/payment/:name", ctrl.getPaymentsByAssociate); // READ BY NAME - GET /api/associates/payment/:name
router.delete("/payment/:id", ctrl.deletePayment);   // DELETE PAYMENT - DELETE /api/associates/payment/:id

// Associate CRUD Routes
router.post("/", ctrl.addAssociate);                 // CREATE - POST /api/associates
router.get("/", ctrl.getAssociates);                 // READ ALL - GET /api/associates
router.get("/:id", ctrl.getAssociateById);           // READ SINGLE - GET /api/associates/:id
router.put("/:id", ctrl.updateAssociate);            // UPDATE - PUT /api/associates/:id
router.delete("/:id", ctrl.deleteAssociate);         // DELETE - DELETE /api/associates/:id

// Test route
router.get("/test/route", (req, res) => {
  res.json({ success: true, message: "Associates route is working!" });
});

module.exports = router;