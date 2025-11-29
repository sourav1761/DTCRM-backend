const express = require("express");
const router = express.Router();
const comparisonCtrl = require("../controllers/comparisonController");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "..", "..", "uploads") });

/*
 Expect files:
  - fileA : single
  - fileB : single
*/
router.post("/", upload.fields([{ name: "fileA" }, { name: "fileB" }]), comparisonCtrl.createComparison);
router.get("/", comparisonCtrl.getComparisons);

module.exports = router;
