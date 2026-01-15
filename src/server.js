// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// const app = express();

// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const uploadsPath = path.join(__dirname, "..", "uploads");
// if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });

// app.use("/uploads", express.static(uploadsPath));

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => process.exit(1));

// app.use("/api/leads", require("./routes/Lead"));

// app.get("/api/test", (req, res) => {
//   res.json({ success: true, message: "Server OK" });
// });

// app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
//   console.log("🚀 Server Running on Network");
// });

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// =========================
// ENV CHECK
// =========================
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "*", // 🔒 restrict in production
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// UPLOADS FOLDER
// =========================
const uploadsPath = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// =========================
// MONGODB
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// =========================
// ROUTES
// =========================
console.log("📦 Loading Routes...");

app.use("/api/auth", require("./routes/auth"));
app.use("/api/leads", require("./routes/Lead"));
app.use("/api/loans", require("./routes/loan"));
app.use("/api/associates", require("./routes/associate"));
app.use("/api/payments", require("./routes/paymentHistoryRoutes"));

// ⚠️ Debug only — remove in prod
app.use(
  "/api/wallet",
  (req, res, next) => {
    console.log("🔥 Wallet middleware hit");
    next();
  },
  require("./routes/wallet")
);

// =========================
// TEST ROUTE
// =========================
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server OK" });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Running on port ${PORT}`);
});
