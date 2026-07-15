const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/cleaningController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload dataset file
router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;