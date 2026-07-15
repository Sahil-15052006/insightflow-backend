const {
    createDataset,
    fetchDatasets,
    fetchDatasetById,
    removeDataset,
  } = require("../services/datasetService");
  
  // Save dataset
  const saveDataset = async (req, res) => {
    try {
      const dataset = await createDataset(
        req.user.id,
        req.body
      );
  
      res.status(201).json(dataset);
    } catch (err) {
      res.status(500).json({
        message: "Failed to save dataset",
        error: err.message,
      });
    }
  };
  
  // Get all datasets
  const getDatasets = async (req, res) => {
    try {
      const datasets = await fetchDatasets(req.user.id);
  
      res.json(datasets);
    } catch (err) {
      res.status(500).json({
        message: "Failed to fetch datasets",
        error: err.message,
      });
    }
  };
  
  // Get single dataset
  const getDatasetById = async (req, res) => {
    try {
      const dataset = await fetchDatasetById(
        req.params.id,
        req.user.id
      );
  
      if (!dataset) {
        return res.status(404).json({
          message: "Dataset not found",
        });
      }
  
      res.json(dataset);
    } catch (err) {
      res.status(500).json({
        message: "Error fetching dataset",
        error: err.message,
      });
    }
  };
  
  // Delete dataset
  const deleteDataset = async (req, res) => {
    try {
      const deleted = await removeDataset(
        req.params.id,
        req.user.id
      );
  
      if (!deleted) {
        return res.status(404).json({
          message: "Dataset not found",
        });
      }
  
      res.json({
        message: "Dataset deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: "Delete failed",
        error: err.message,
      });
    }
  };
  
  module.exports = {
    saveDataset,
    getDatasets,
    getDatasetById,
    deleteDataset,
  };