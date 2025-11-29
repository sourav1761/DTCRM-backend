const mongoose = require("mongoose");

const ComparisonSchema = new mongoose.Schema({
  docNumberA: { type: String },
  docNumberB: { type: String },
  fileA: { type: String },
  fileB: { type: String },
  resultSummary: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comparison", ComparisonSchema);
