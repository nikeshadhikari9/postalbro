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
            const apis = getUniqueApis(DB_RECENT.apis, DB_SAVED.apis, category);

            if (!apis.length) {
                logger.warn(`No APIs found for category: ${category}`);
                process.exit(0);
            }

            logger.info(`Running ${apis.length} API(s) of category: ${category}`);
            let count = 1;
            for (const api of apis) {
                logger.info(`${count}/${apis.length} Testing API: ${api.method.toUpperCase()} ${api.url}`);
                await testCmd(api.method, api.url, api.createdOptions);
                count++;
            }
            return;
        }

        // Run single API by ID
        if (id) {
            const api = DB_RECENT.apis.find(a => a.id === id) || DB_SAVED.apis.find(a => a.id === id);

            if (!api) {
                logger.warn(`No API found with id: ${id}`);
                process.exit(0);
            }

            logger.info(`Testing single API: ${api.method.toUpperCase()} ${api.url}`);
            const createdOptions = {
                data: api.data || {},
                header: api.header || {},
                query: api.query || {},
                file: api.file || [],
                multipart: api.multipart || false,
                category: api.category || "",
            };
            await testCmd(api.method, api.url, createdOptions);
            return;
        }

        // If neither ID nor category provided
        if (!id || !category) {
            logger.warn("You must provide either an API id (-i) or a category (-c) to run.");
            process.exit(1);
        }

    } catch (error) {
        logger.error("An error occurred while running API tests:", e);
        process.exit(1);
    }
};
