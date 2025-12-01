// // src/server.js
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Connect DB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err);
//     process.exit(1);
//   });

// // ROUTES (correct names)
// app.use("/api/leads", require("./routes/Lead"));       // ✔ Lead.js
// app.use("/api/wallet", require("./routes/wallet"));   // ✔ wallet.js
// app.use("/api/payments", require("./routes/payments")); 
// app.use("/api/comparisons", require("./routes/comparison"));
// app.use("/api/credits", require("./routes/credits"));
// app.use("/api/dashboard", require("./routes/dashboard"));
// app.use("/api/auth", require("./routes/auth"));

// // Root
// app.get("/", (req, res) => res.json({ ok: true, message: "Backend running" }));

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));


// src/server.js
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

// ----------------------------
// CONNECT MONGODB
// ----------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// ----------------------------
// ROUTES
// ----------------------------
app.use("/api/leads", require("./routes/Lead"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/comparisons", require("./routes/comparison"));
app.use("/api/credits", require("./routes/credits"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/credit", require("./routes/credits"));

// app.use("/api/auth", require("./routes/auth"));

// Root
app.get("/", (req, res) =>
  res.json({ ok: true, message: "Backend running successfully" })
);

// ----------------------------
// START SERVER
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
