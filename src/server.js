require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

app.use("/uploads", express.static(uploadsPath));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => process.exit(1));

app.use("/api/leads", require("./routes/Lead"));

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server OK" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server Running");
});
