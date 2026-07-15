// Convert row based data into column based data
const structureDataIntoColumns = (data, keyNames) => {
    const structuredData = {};
  
    keyNames.forEach((key) => {
      structuredData[key] = data.map((row) => row[key]);
    });
  
    return structuredData;
  };
  
  // Detect data type of every column
  const identifyKeyDataType = (data) => {
    const keyTypes = {};
  
    for (const row of data) {
      for (const key in row) {
        const value = row[key];
  
        // Skip empty values
        if (value === null || value === undefined) {
          continue;
        }
  
        if (typeof value === "boolean") {
          keyTypes[key] = "boolean";
        }
        else if (typeof value === "number") {
          keyTypes[key] = "number";
        }
        else if (!isNaN(Date.parse(value))) {
          keyTypes[key] = "date";
        }
        else if (typeof value === "string") {
          keyTypes[key] = "string";
        }
      }
    }
  
    return keyTypes;
  };
  
  // Group columns by type
  const groupKeysByTypes = (keyTypes, structuredData) => {
    const keysByType = {
      numeric: [],
      boolean: [],
      date: [],
      categorical: [],
      unique: [],
    };
  
    const totalRows =
      Object.values(structuredData)[0]?.length || 0;
  
    for (const key in keyTypes) {
      const values = structuredData[key] || [];
  
      const uniqueCount = new Set(
        values.filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            value !== ""
        )
      ).size;
  
      const uniqueRatio =
        totalRows > 0
          ? uniqueCount / totalRows
          : 0;
  
      if (keyTypes[key] === "number") {
        keysByType.numeric.push(key);
      }
      else if (keyTypes[key] === "boolean") {
        keysByType.boolean.push(key);
      }
      else if (keyTypes[key] === "date") {
        keysByType.date.push(key);
      }
      else if (uniqueRatio > 0.9) {
        keysByType.unique.push(key);
      }
      else {
        keysByType.categorical.push(key);
      }
    }
  
    return keysByType;
  };
  
  // Main analysis service
  const processAnalysis = (data) => {
    const keyNames = Object.keys(data[0]);
  
    const structuredData =
      structureDataIntoColumns(
        data,
        keyNames
      );
  
    const keyTypes =
      identifyKeyDataType(data);
  
    const keyTypesGroups =
      groupKeysByTypes(
        keyTypes,
        structuredData
      );
  
    return {
      structuredData,
      keyTypes,
      keyTypesGroups,
    };
  };
  
  module.exports = {
    processAnalysis,
  };