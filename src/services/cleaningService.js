const DataCleaner = require("../utils/DataCleaner");
const SchemaDetector = require("../utils/SchemaDetector");
const DataTypeConverter = require("../utils/DataTypeConverter");
const generateInsights = require("../utils/InsightGenerator");

// Main data processing function
const processData = (data) => {
  // Detect column types
  const schema = SchemaDetector(data);

  // Convert values to proper data types
  const convertedData = data.map((row) => {
    return DataTypeConverter(row, schema);
  });

  // Clean dataset
  const cleanedData = DataCleaner(
    convertedData,
    schema
  );

  // Create grouped schema for analytics
  const groupedSchema = groupSchema(schema);

  // Generate insights
  const insights = generateInsights(
    cleanedData,
    groupedSchema
  );

  return {
    schema,
    groupedSchema,
    data: cleanedData,
    insights,
  };
};

// Group fields by type
const groupSchema = (schema, totalRows) => {
  const grouped = {
    numeric: [],
    categorical: [],
    boolean: [],
    unique: [],
    date: [],
  };

  for (const key in schema) {
    const { type, uniqueCount } = schema[key];

    const uniqueRatio =
      totalRows > 0
        ? uniqueCount / totalRows
        : 0;

    const lowerKey = key.toLowerCase();

    // IDs and unique identifiers
    if (
      lowerKey.includes("id") ||
      type === "email" ||
      type === "phone" ||
      type === "url" ||
      uniqueRatio > 0.9
    ) {
      grouped.unique.push(key);
    }

    // Numeric metrics
    else if (
      type === "number" ||
      type === "percentage"
    ) {
      grouped.numeric.push(key);
    }

    // Boolean fields
    else if (type === "boolean") {
      grouped.boolean.push(key);
    }

    // Time series fields
    else if (type === "date") {
      grouped.date.push(key);
    }

    // Categories
    else {
      grouped.categorical.push(key);
    }
  }

  return grouped;
};

module.exports = {
  processData,
};