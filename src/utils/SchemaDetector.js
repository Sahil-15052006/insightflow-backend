const {isBoolean} = require("./helpers/isBoolean");
const {isEmail} = require("./helpers/isEmail");
const {isPercentage} = require("./helpers/isPercentage");
const {isNumber} = require("./helpers/isNumber");
const {isDate} = require("./helpers/isDate");
const getUniqueValues = require("./helpers/getUniqueValues");

function SchemaDetector(data) {
    const dataSchema = {};

    if (!data || data.length === 0) {
        return dataSchema;
    }

    const sampleSize = Math.min(50, data.length);
    const sampleData = data.slice(0, sampleSize);

    const columns = Object.keys(sampleData[0]);

    for (const columnName of columns) {
        let stringCount = 0;
        let numberCount = 0;
        let booleanCount = 0;
        let emailCount = 0;
        let dateCount = 0;
        let percentageCount = 0;
        let totalValid = 0;

        const uniqueValues = getUniqueValues(
            sampleData,
            columnName
        );

        for (let i = 0; i < sampleData.length; i++) {
            let value = sampleData[i][columnName];

            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                continue;
            }

            totalValid++;

            value = String(value)
                .trim()
                .toLowerCase();

            if (isBoolean(value)) {
                booleanCount++;
            } else if (isEmail(value)) {
                emailCount++;
            } else if (isPercentage(value)) {
                percentageCount++;
            } else if (isNumber(value)) {
                numberCount++;
            } else if (isDate(value)) {
                dateCount++;
            } else {
                stringCount++;
            }
        }

        let detectedType = "string";

        if (totalValid === 0) {
            dataSchema[columnName] = {
                type: "string",
                uniqueCount: uniqueValues.length,
            };
            continue;
        }

        if (percentageCount / totalValid > 0.5) {
            detectedType = "percentage";
        } else if (numberCount / totalValid > 0.3) {
            detectedType = "number";
        } else if (booleanCount / totalValid > 0.8) {
            detectedType = "boolean";
        } else if (emailCount / totalValid > 0.5) {
            detectedType = "email";
        } else if (dateCount / totalValid > 0.5) {
            detectedType = "date";
        }

        dataSchema[columnName] = {
            type: detectedType,
            uniqueCount: uniqueValues.length,
        };
    }

    return dataSchema;
}

module.exports = SchemaDetector;