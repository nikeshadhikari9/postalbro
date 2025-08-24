/**
 * search.js
 *
 * Performs a fuzzy search across saved and recent APIs using Fuse.js.
 * Limits results to 10 and provides user-friendly logging.
 *
 * @param {string} query - Search query string
 * @returns {void} - Logs results to console; exits process if errors occur
 */

import { loadRecent, loadDB } from "../utils/storage.js";
import Fuse from "fuse.js";
import logger from "../utils/logger.js";

export default async (query) => {
    try {
        if (!query || typeof query !== "string") {
            logger.error("Search query must be a non-empty string.");
            process.exit(1);
        }

        // Load saved and recent APIs
        const DB_SAVED = await loadDB();
        const DB_RECENT = await loadRecent();

        // Combine saved and recent APIs
        let apis = [];
        if (Array.isArray(DB_RECENT?.apis)) apis.push(...DB_RECENT.apis);
        if (Array.isArray(DB_SAVED?.apis)) apis.push(...DB_SAVED.apis);

        if (apis.length === 0) {
            logger.error("No APIs found in storage.");
            process.exit(1);
        }

        // Configure Fuse.js for fuzzy search
        const fuse = new Fuse(apis, {
            keys: ["url", "method", "category"],
            threshold: 0.35,         // match sensitivity
            includeScore: true,      // optional: include score in results
        });

        // Perform search and limit results to 10
        const results = fuse.search(query).slice(0, 10);

        if (results.length === 0) {
            logger.warn("No matches found for your query.");
            process.exit(0);
        }

        // Print results
        logger.response(`\nSearch results (${results.length}):\n`);
        logger.warn(`- ID  Method  URL  Category`);
        results.forEach((r) => {
            const { id, method, url, category } = r.item;
            const line = `• ${id}  ${method.toUpperCase()}  ${url}  ${category || ""}`;
            logger.success(line);
        });
    } catch (err) {
        logger.error("An error occurred during search:", err);
        process.exit(1);
    }
};
