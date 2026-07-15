const Dataset = require("../models/Datasets");

// Create new dataset
const createDataset = async (userId, datasetData) => {
  const {
    name,
    data,
    schema,
    stats,
    insights,
  } = datasetData;

  return await Dataset.create({
    userId,
    name,
    data,
    schema,
    stats,
    insights,
  });
};

// Get all datasets for a user
const fetchDatasets = async (userId) => {
  return await Dataset.find({
    userId,
  }).select("name createdAt stats");
};

// Get single dataset
const fetchDatasetById = async (
  datasetId,
  userId
) => {
  return await Dataset.findOne({
    _id: datasetId,
    userId,
  });
};

// Delete dataset
const removeDataset = async (
  datasetId,
  userId
) => {
  return await Dataset.findOneAndDelete({
    _id: datasetId,
    userId,
  });
};

module.exports = {
  createDataset,
  fetchDatasets,
  fetchDatasetById,
  removeDataset,
};