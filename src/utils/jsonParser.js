/**
 * jsonParser.js
 *
 * Parses a JSON string or pseudo-JSON into an object.
 * Handles standard JSON as well as simplified key:value strings like "{key: val, key2: val2}".
 *
 * @param {string} input - JSON string or pseudo-JSON
 * @returns {object} - Parsed object
 */
function jsonParser(input) {
    if (!input) return {}; // Return empty object if no input

    let obj;

    try {
        // Try standard JSON parsing first
        obj = JSON.parse(input);
    } catch {
        // Handle pseudo-JSON format {key: val, key2: val2}
        let str = input.trim();

        // Remove surrounding braces if present
        if (str.startsWith("{") && str.endsWith("}")) {
            str = str.slice(1, -1).trim();
        }

        obj = {};
        if (str.length === 0) return obj;

        // Split by commas outside quotes
        const parts = str.split(/\s*,\s*/);
        for (let part of parts) {
            let [key, value] = part.split(/\s*:\s*/);
            if (!key) continue;

            key = key.trim();
            value = value ? value.trim() : "";

            // Remove surrounding quotes if present
            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }

            // Convert numeric strings to numbers
            if (/^\d+$/.test(value)) {
                value = Number(value);
            }

            obj[key] = value;
        }
    }

    // Ensure numeric strings in proper JSON are converted
    for (let key in obj) {
        if (typeof obj[key] === "string" && /^\d+$/.test(obj[key])) {
            obj[key] = Number(obj[key]);
        }
    }

    return obj;
}

export default jsonParser;
