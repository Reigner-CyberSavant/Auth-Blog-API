
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure "uploads" folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save to /uploads
  },
  filename: (req, file, cb) => {
    // Unique filename with timestamp + extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter (optional: restrict file types)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) and pdf allowed!"));
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
