const express = require("express");
const router = express.Router();

// 🔐 HARDCODED USERS
const USERS = [
  {
    id: "admin_1",
    username: "DEEEPAKTYAGI",
    password: "110010161@mhA",
    role: "admin",
    name: "Admin"
  },
  {
    id: "emp_1",
    username: "employee1",
    password: "chandan@07",
    role: "employee",
    name: "Employee"
  },
  {
    id: "emp_2",
    username: "employee2",
    password: "jitendra@07",
    role: "employee",
    name: "Employee"
  }
];

// LOGIN API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  return res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      username: user.username,
    },
  });
});

module.exports = router;
