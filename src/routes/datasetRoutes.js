const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  saveDataset,
  getDatasets,
  getDatasetById,
  deleteDataset,
} = require("../controllers/datasetController");

// Save dataset
router.post("/", auth, saveDataset);

// Get all datasets
router.get("/", auth, getDatasets);

// Get single dataset
router.get("/:id", auth, getDatasetById);

// Delete dataset
router.delete("/:id", auth, deleteDataset);

module.exports = router;