function isDate(value) {
    const date = new Date(value);

    return !isNaN(date.getTime());
}

function convertDate(value) {
    let date = new Date(value);

    // Handle dd/mm/yyyy format
    if (
        typeof value === "string" &&
        value.includes("/")
    ) {
        const parts = value.split("/");

        if (parts.length === 3 && parts[0].length === 2) {
            date = new Date(
                `${parts[2]}-${parts[1]}-${parts[0]}`
            );
        }
    }

    if (isNaN(date.getTime())) {
        return null;
    }

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

module.exports = {
    isDate,
    convertDate
};