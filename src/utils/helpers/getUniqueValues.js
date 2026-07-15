function getUniqueValues(data, columnName) {
    const uniqueValues = new Set();

    for (const row of data) {
        const value = row[columnName];

        if (
            value !== null &&
            value !== undefined &&
            value !== ""
        ) {
            uniqueValues.add(String(value).trim());
        }
    }

    return [...uniqueValues];
}

module.exports = getUniqueValues;