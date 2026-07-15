const express = require("express");
const router = express.Router();

const {
  analyzeData,
} = require("../controllers/analysisController");

// Analyze cleaned dataset
router.post("/analyze", analyzeData);

module.exports = router;