const {
    processAnalysis,
  } = require("../services/analysisService");
  
  // Handle analysis request
  const analyzeData = (req, res) => {
    try {
      const { data } = req.body;
  
      // Check if data exists
      if (!data || !Array.isArray(data)) {
        return res.status(400).json({
          message: "Data not found",
        });
      }
  
      const finalData = processAnalysis(data);
  
      res.status(200).json({
        finalData,
      });
  
    } catch (err) {
      res.status(500).json({
        message: "Server Error",
        error: err.message,
      });
    }
  };
  
  module.exports = {
    analyzeData,
  };