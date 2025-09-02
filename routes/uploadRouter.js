
const express = require("express");
const upload = require("../middlewares/uploads");

const router = express.Router();

// Upload route → POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file, // details about the uploaded file
  });
});

module.exports = router;
