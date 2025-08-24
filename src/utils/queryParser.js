/**
 * queryParser.js
 *
 * Converts a JSON string or pseudo-JSON string into a URL-encoded query string.
 * 
 * Examples:
 *   queryParser('{"name":"John","age":30}') => "name=John&age=30"
 *   queryParser("{name:John, age:30}")      => "name=John&age=30"
 *
 * @param {string|Object} input - JSON string, pseudo-JSON string, or object
 * @returns {string} URL-encoded query string
 */

import { URLSearchParams } from "url";

function queryParser(input) {
    if (!input) return "";

    let obj;

    try {
        // Attempt to parse as proper JSON first
        obj = typeof input === "string" ? JSON.parse(input) : input;
    } catch {
        // Fallback for pseudo-JSON format: {key:val, key2:val2}
        let str = input.trim();

        if (str.startsWith("{") && str.endsWith("}")) {
            str = str.slice(1, -1);
        }

        obj = {};
        const parts = str.split(/\s*,\s*/); // Split by commas outside quotes
        for (let part of parts) {
            let [key, value] = part.split(/\s*:\s*/);
            if (!key || !value) continue;

            key = key.trim();
            value = value.trim();

            // Remove surrounding quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Convert numeric strings to numbers
            if (/^\d+$/.test(value)) value = Number(value);

            obj[key] = value;
        }
    }

    // Convert object to URLSearchParams string
    return new URLSearchParams(obj).toString();
}

export default queryParser;
