const express = require("express");
const router = express.Router();
const dashboardCtrl = require("../controllers/dashboardController");

router.get("/overview", dashboardCtrl.getOverview);

module.exports = router;
