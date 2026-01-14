// const User = require("../models/User");

// // REGISTER (Admin or Employee)
// exports.register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists)
//       return res.status(400).json({ success: false, message: "Email already exists" });

//     const user = await User.create({ name, email, password, role });

//     res.status(201).json({ success: true, message: "User registered", user });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // LOGIN (Simple)
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     if (user.password !== password)
//       return res.status(400).json({ success: false, message: "Wrong password" });

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role
//       }
//     });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
