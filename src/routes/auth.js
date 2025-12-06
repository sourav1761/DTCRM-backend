const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// 👉 Hardcoded Users
const USERS = [
  {
    id: "admin_1",
    username: "admin",
    password: "admin123",
    role: "admin"
  },
  {
    id: "emp_1",
    username: "employee1",
    password: "emp123",
    role: "employee"
  },
  {
    id: "emp_2",
    username: "employee2",
    password: "emp456",
    role: "employee"
  }
];

// LOGIN API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  // Generate JWT Token
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "mysecret",
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    },
    token
  });
});

module.exports = router;
