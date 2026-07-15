function isBoolean(value) {
    const val = String(value).trim().toLowerCase();

    return val === "true" ||
           val === "false" ||
           val === "1" ||
           val === "0" ||
           val === "yes" ||
           val === "no";
}

function convertBoolean(value) {
    const val = String(value).trim().toLowerCase();

    if (val === "true" || val === "1" || val === "yes" ) {
        return true;
    }

    if (val === "false" || val === "0" || val === "no") {
        return false;
    }

    return null;
}

module.exports = {
    isBoolean,
    convertBoolean
};