/**
 * list.js
 * 
 * Lists saved APIs from storage based on filters:
 * - --all : list all saved APIs
 * - --category <category> : filter APIs by category
 * - --method <method> : filter APIs by HTTP method
 * - --host <host> : filter APIs by host
 * 
 * @param {object} options - Commander CLI options
 * @returns {Promise<void>}
 */

import { loadDB } from "../utils/storage.js";
import logger from "../utils/logger.js";

export default async (options) => {
    try {
        // Load saved APIs
        const DB_SAVED = await loadDB();
        const apis = DB_SAVED?.apis || [];

        if (apis.length === 0) {
            logger.warn("No saved APIs found.");
            process.exit(0);
        }

        let apiList = [...apis]; // Start with all APIs

        // Filter by category if provided
        if (options.category) {
            apiList = apiList.filter((api) => api.category === options.category);
        }

        // Filter by HTTP method if provided
        if (options.method) {
            apiList = apiList.filter(
                (api) => api.method.toLowerCase() === options.method.toLowerCase()
            );
        }

        /**
         * Extract host from a given URL
         * @param {string} url - Full URL
         * @returns {string|null} host (protocol + host) or null if invalid
         */
        function extractHost(url) {
            try {
                const parsed = new URL(url);
                return `${parsed.protocol}//${parsed.host}`;
            } catch (error) {
                logger.error("Invalid URL found in saved APIs:", url);
                return null;
            }
        }

        // Filter by host if provided
        if (options.host) {
            apiList = apiList.filter((api) => {
                const host = extractHost(api.url);
                return host && host === options.host;
            });
        }

        // If no filters and --all is not used, show warning
        if (!options.all && !options.category && !options.method && !options.host) {
            logger.warn("No filter provided. Use --all to list everything.");
            process.exit(0);
        }

        if (apiList.length === 0) {
            logger.warn("No matching saved APIs found.");
            process.exit(0);
        }

        // Print header
        logger.response(`\nSaved APIs (${apiList.length}):\n`);
        const lineHeader = "- ID  Method  URL  Category";
        logger.warn(lineHeader);

        // Print APIs
        apiList.forEach((api) => {
            const line = `• ${api.id}   ${api.method.toUpperCase()}   ${api.url}   ${api.category || ""}`;
            logger.success(line);
        });

    } catch (err) {
        logger.error("An error occurred while listing saved APIs:", err);
        process.exit(1);
    }
};
