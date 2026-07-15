function isNumber(value) {
    return /^-?\d+(\.\d+)?$/.test(value);
}

function convertNumber(value) {
    return isNumber(value)
        ? Number(value)
        : null;
}

module.exports = {
    isNumber,
    convertNumber
};