/**
 * http.js
 *
 * Generic HTTP request utility for CLI API testing.
 * Supports JSON, URL-encoded, and multipart/form-data (files + fields).
 *
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {string} url - Full request URL
 * @param {object|string} [data={}] - Request body data
 * @param {object} [headers={}] - Custom request headers
 * @param {object|string} [params={}] - Query parameters
 * @param {boolean} [encoded=false] - Send data as application/x-www-form-urlencoded
 * @param {boolean} [multipart=false] - Send data as multipart/form-data
 * @param {Array} [files=[]] - Array of files: [{ filename, filePath }]
 * @returns {Promise<any>} - Response data
 */

import axios from "axios";
import chalk from "chalk";
import queryParser from "./queryParser.js";
import FormData from "form-data";
import fs from "fs";
import logger from "./logger.js";

const httpRequest = async (
    method,
    url,
    data = {},
    headers = {},
    params = {},
    encoded = false,
    multipart = false,
    files = []
) => {
    try {
        if (!method || !url) {
            throw new Error("HTTP method and URL are required");
        }

        const config = {
            method: method.toLowerCase(),
            url,
            headers: { ...headers },
        };

        // ---- Query parameters ----
        if (params && Object.keys(params).length > 0) {
            try {
                config.params =
                    typeof params === "string" ? queryParser(params) : queryParser(JSON.stringify(params));
            } catch (err) {
                throw new Error("Invalid query parameters provided");
            }
        }

        // ---- URL-encoded request ----
        if (encoded && data) {
            config.data =
                typeof data === "string" ? queryParser(data) : queryParser(JSON.stringify(data));
        }

        // ---- Multipart/form-data ----
        else if (multipart) {
            const form = new FormData();

            // Attach files
            if (Array.isArray(files) && files.length > 0) {
                files.forEach((f) => {
                    const { filename, filePath } = f;
                    if (!fs.existsSync(filePath)) {
                        logger.warn(`File not found: ${filePath}`);
                        return;
                    }
                    form.append(filename, fs.createReadStream(filePath));
                });
            }

            // Attach data fields
            if (data && typeof data === "object" && Object.keys(data).length > 0) {
                Object.entries(data).forEach(([key, value]) => {
                    form.append(key, value);
                });
            }

            config.data = form;
            config.headers = { ...config.headers, ...form.getHeaders() };
        }

        // ---- Normal JSON request ----
        else if (data && Object.keys(data).length > 0) {
            config.data = data;
        }

        // ---- Perform request ----
        const response = await axios(config);

        // ---- Logging ----
        let statusColor = chalk.white;
        if (response.status >= 200 && response.status < 300) statusColor = chalk.green;
        else if (response.status >= 300 && response.status < 400) statusColor = chalk.yellow;
        else if (response.status >= 400) statusColor = chalk.red;

        console.log(statusColor(`Status: ${response.status} ${response.statusText}`), "\nResponse:");

        if (response.data && typeof response.data === "object") {
            console.log(chalk.green(JSON.stringify(response.data, null, 2)), "\n");
        } else {
            console.log(chalk.green(response.data), "\n");
        }

        // ---- Cookies ----
        const cookies = response.headers["set-cookie"];
        if (cookies && cookies.length > 0) {
            const rawCookie = cookies[0].split(";")[0]; // only "name=value"
            console.log(chalk.blue("Cookie received:"));
            console.log(rawCookie, "\n");
        }

        return response.data;
    } catch (error) {
        // Handle axios errors
        if (error.response) {
            let msg = error.response.data;
            if (typeof msg === "object") msg = JSON.stringify(msg, null, 2);
            else if (typeof msg === "string") msg = msg.replace(/<\/?[^>]+(>|$)/g, "").trim();
            logger.error(`Response error: ${error.response.status} ${error.response.statusText}`);
            console.error(chalk.red(msg), "\n");
        } else if (error.request) {
            logger.error("No response received from server");
            process.exit(1);
        } else {
            logger.error("Request setup error:", error.message);
            process.exit(1);
        }


    }
};

export default httpRequest;
