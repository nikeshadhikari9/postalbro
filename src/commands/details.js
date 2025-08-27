/**
 * run.js
 * 
 * Runs saved or recent APIs based on CLI options.
 * 
 * Options:
 * - --id <id>       : Run a single API by its ID.
 * - --category <cat>: Run all APIs of a specific category (unique between recent and saved).
 * 
 * @param {object} options - CLI options with 'id' and/or 'category' properties.
 * @returns {Promise<void>}
 */

import { loadRecent, loadDB } from "../utils/storage.js";
import testCmd from "./test.js";
import logger from "../utils/logger.js";
import { getUniqueApis } from "../utils/getUniqueApis.js";
import displayDetails from "../utils/displayDetails.js";

export default async (options) => {
    try {
        const { id, category } = options;

        // Load recent and saved APIs
        const DB_RECENT = await loadRecent();
        const DB_SAVED = await loadDB();

        if (!DB_RECENT?.apis?.length && !DB_SAVED?.apis?.length) {
            logger.warn("No APIs found in storage.");
            process.exit(0);
        }

        // Run all APIs of a category
        if (category) {
            const uniqueApis = getUniqueApis(DB_RECENT.apis, DB_SAVED.apis, category);

            if (!uniqueApis.length) {
                logger.warn(`No APIs found for category: ${category}`);
                process.exit(0);
            }
            let apis = [];
            uniqueApis.forEach((api) => {
                const newApi = {
                    id: api.id,
                    method: api.method,
                    url: api.url,
                    data: api.createdOptions.data,
                    query: api.createdOptions.query,
                    header: api.createdOptions.header,
                    file: api.createdOptions.file,
                }
                apis.push(newApi);
            })
            logger.info(`\nDisplaying details of ${apis.length} API(s) in category: ${category}\n`);
            displayDetails(apis)
        }

        // Run single API by ID
        if (id) {
            const api = DB_RECENT.apis.find(a => a.id === id) || DB_SAVED.apis.find(a => a.id === id);
            let apis = [];
            if (!api) {
                logger.warn(`No API found with id: ${id}`);
                process.exit(0);
            }
            apis.push(api);
            logger.info(`\nDisplaying details of API with id: ${id}\n`);
            displayDetails(apis)
        }

        // If neither ID nor category provided
        if (!id && !category) {
            logger.warn("You must provide either an API id (-i) or a category (-c) to run.");
            process.exit(1);
        }

    } catch (error) {
        // Robust error handling
        if (error instanceof Error) {
            logger.error(`Error running API: ${error.message}`);
            logger.error(error.stack);
        } else {
            logger.error("Unknown error:", error);
        }
        process.exit(1);
    }
};
