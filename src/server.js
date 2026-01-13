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
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "*",
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

app.use("/api/leads", require("./routes/Lead"));      // lead APIs
app.use("/api/wallet", require("./routes/wallet"));  // ✅ wallet APIs
app.use("/api/associates", require("./routes/associate"));

// =========================
// TEST
// =========================
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Server OK" });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server Running on port ${PORT}`);
});
