const { convertBoolean } = require("./helpers/isBoolean");
const { convertNumber } = require("./helpers/isNumber");
const { convertPercentage } = require("./helpers/isPercentage");
const { convertDate } = require("./helpers/isDate");
const { convertEmail } = require("./helpers/isEmail");

function DataTypeConverter(row, schema) {

    const newRow = {};

    for (const key in schema) {
        let value = row[key];
    
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            newRow[key] = null;
            continue;
        }
    
        value = String(value).trim();
    
        const { type } = schema[key];
    
        if (type === "percentage") {
            newRow[key] = convertPercentage(value);
        }
        else if (type === "number") {
            newRow[key] = convertNumber(value);
        }
        else if (type === "boolean") {
            newRow[key] = convertBoolean(value);
        }
        else if (type === "date") {
            newRow[key] = convertDate(value);
        }
        else if (type === "email") {
            newRow[key] = convertEmail(value);
        }
        else {
            newRow[key] = value;
        }
    }

    return newRow;
}

module.exports = DataTypeConverter;