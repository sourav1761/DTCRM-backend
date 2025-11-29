const Comparison = require("../models/Comparison");
const path = require("path");

// create comparison (files uploaded by multer)
exports.createComparison = async (req, res) => {
  try {
    const { docNumberA, docNumberB } = req.body;
    const fileA = req.files && req.files.fileA ? req.files.fileA[0].path : null;
    const fileB = req.files && req.files.fileB ? req.files.fileB[0].path : null;

    const comp = await Comparison.create({
      docNumberA, docNumberB, fileA, fileB, resultSummary: "Not analyzed - manual compare"
    });

    res.status(201).json({ success:true, comp });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};

exports.getComparisons = async (req, res) => {
  try {
    const comps = await Comparison.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success:true, comps });
  } catch(err){ res.status(500).json({ success:false, message: err.message }); }
};
