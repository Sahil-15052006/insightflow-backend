function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function convertEmail(value) {
    return isEmail(value)
        ? value
        : null;
}

module.exports = {
    isEmail,
    convertEmail
};