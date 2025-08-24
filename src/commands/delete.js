/**
 * delete.js
 * 
 * Handles deletion of saved APIs.
 * 
 * Accepts filters via CLI options:
 * - --all : delete all saved APIs
 * - --id <id> : delete a single API by ID
 * - --category <category> : delete all APIs in a category
 * - --yes : skip confirmation prompt
 * 
 * @param {object} options - Commander CLI options
 * @returns {Promise<void>}
 */

import { loadDB, saveDB } from "../utils/storage.js";
import logger from "../utils/logger.js";
import readline from "readline";

export default async (options) => {
    try {
        // Load saved APIs
        const DB_SAVED = await loadDB();
        const apis = DB_SAVED?.apis || [];

        if (apis.length === 0) {
            logger.warn("No saved APIs found.");
            process.exit(0);
        }

        let toDelete = [];

        // Determine deletion targets
        if (options.all) {
            toDelete = [...apis];
        } else if (options.id) {
            const api = apis.find((a) => a.id === options.id);
            if (!api) {
                logger.warn(`No API found with id: ${options.id}`);
                process.exit(0);
            }
            toDelete = [api];
        } else if (options.category) {
            toDelete = apis.filter((a) => a.category === options.category);
            if (toDelete.length === 0) {
                logger.warn(`No APIs found in category: ${options.category}`);
                process.exit(0);
            }
        } else {
            logger.warn("No filter provided. Use --all, --id, or --category to delete.");
            process.exit(0);
        }

        // Display selected APIs
        logger.response(`API(s) selected to be deleted:`);
        const lineHeader = "- ID  Method  URL  Category";
        logger.success(lineHeader);
        toDelete.forEach((api) => {
            const line = `• ${api.id}   ${api.method.toUpperCase()}   ${api.url}   ${api.category || ""}`;
            logger.warn(line);
        });

        /**
         * Confirm deletion from user if --yes not provided
         */
        const confirmAndDelete = async () => {
            if (!options.yes) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });

                const question = (q) => new Promise((resolve) => rl.question(q, resolve));

                const ans = await question(
                    `Are you sure you want to delete ${toDelete.length} API(s)? (y/N): `
                );
                rl.close();

                if (ans.toLowerCase() !== "y") {
                    logger.warn("Aborted deletion.");
                    process.exit(0);
                }
            }

            // Perform deletion
            const remaining = apis.filter((a) => !toDelete.includes(a));
            DB_SAVED.apis = remaining;
            await saveDB(DB_SAVED);

            logger.success(
                `Deleted ${toDelete.length} API(s). Remaining: ${remaining.length}`
            );
        };

        await confirmAndDelete();

    } catch (err) {
        logger.error("An error occurred during deletion:", err);
        process.exit(1);
    }
};
