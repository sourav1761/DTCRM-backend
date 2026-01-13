const mongoose = require("mongoose");

const AssociateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workPlace: { type: String },
  contact: { type: String, required: true },
  location: { type: String },
  joinDate: { type: Date, required: true },
  totalWorks: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Associate", AssociateSchema);
