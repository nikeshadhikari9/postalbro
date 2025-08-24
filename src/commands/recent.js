/**
 * recent.js
 * 
 * Lists recently called APIs from storage based on filters:
 * - --all : list all recent APIs
 * - --category <category> : filter recent APIs by category
 * 
 * @param {object} options - Commander CLI options
 * @returns {Promise<void>}
 */

import { loadRecent } from "../utils/storage.js";
import logger from "../utils/logger.js";

export default async (options) => {
    try {
        // Load recent APIs
        const DB_RECENT = await loadRecent();
        const allApis = DB_RECENT?.apis || [];

        if (allApis.length === 0) {
            logger.warn("No recently called APIs found.");
            process.exit(0);
        }

        let apis = [];

        // Filter by category if provided
        if (options.category) {
            apis = allApis.filter((api) => api.category === options.category);

            if (apis.length === 0) {
                logger.warn(`No recently called APIs found for category: ${options.category}`);
                process.exit(0);
            }

            logger.response(`\nAll recent APIs of category "${options.category}" (${apis.length}):\n`);
        }

        // Show all recent APIs if --all is used
        if (options.all) {
            apis = [...allApis];
            logger.response(`\nAll recent APIs (${apis.length}):\n`);
        }

        // If neither --all nor --category is provided
        if (!options.all && !options.category) {
            logger.warn("No filter provided. Use --all or --category to view recent APIs.");
            process.exit(0);
        }

        // Print header
        const lineHeader = "- ID  Method  URL  Category";
        logger.warn(lineHeader);

        // Print APIs
        apis.forEach((api) => {
            const line = `• ${api.id}  ${api.method.toUpperCase()}  ${api.url}  ${api.category || ""}`;
            logger.success(line);
        });

    } catch (err) {
        logger.error("An error occurred while fetching recent APIs:", err);
        process.exit(1);
    }
};
