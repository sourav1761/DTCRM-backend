require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve file uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ROUTES
app.use("/api/leads", require("./routes/Lead"));   // ✔ KEEP THIS
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/comparisons", require("./routes/comparison"));
app.use("/api/credits", require("./routes/credits"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/auth"));

// ❌ REMOVE THIS LINE!!
// app.use("/api/leads", require("./src/routes/Lead"));

// Root
app.get("/", (req, res) =>
  res.json({ ok: true, message: "Backend running successfully" })
);

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
