// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const loanUploadPath = path.join(__dirname, "..", "..", "uploads", "loans");

// if (!fs.existsSync(loanUploadPath)) {
//   fs.mkdirSync(loanUploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, loanUploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
//   if (!allowedTypes.includes(file.mimetype)) {
//     cb(new Error("Only PDF, JPG, PNG allowed"), false);
//   } else {
//     cb(null, true);
//   }
// };

// const uploadLoanDocs = multer({
//   storage,
//   fileFilter,
// }).array("documents", 5); // max 5 files

// module.exports = { uploadLoanDocs };









const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "loans");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only PDF, JPG, PNG allowed"), false);
  } else {
    cb(null, true);
  }
};

const uploadLoanDocs = multer({
  storage,
  fileFilter,
}).any();   // ✅ FIXED


module.exports = { uploadLoanDocs };
