function isPercentage(value) {
    return /^\d+(\.\d+)?%$/.test(value);
}

function convertPercentage(value) {
    return isPercentage(value)
        ? Number(value.replace("%", ""))
        : null;
}

module.exports = {
    isPercentage,
    convertPercentage
};