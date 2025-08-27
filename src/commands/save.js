/**
 * save.js
 *
 * Saves a new API configuration to either the main DB or recent DB.
 * Handles JSON parsing, multipart files, headers, and query parameters.
 *
 * @param {string} method - HTTP method (GET, POST, PUT, PATCH, DELETE, etc.)
 * @param {string} url - Full API URL
 * @param {object} options - CLI options:
 *   - data: JSON string or object of request body
 *   - header: JSON string or object of headers
 *   - query: JSON string or object of query params
 *   - category: category string
 *   - encoded: boolean for x-www-form-urlencoded
 *   - multipart: boolean for multipart/form-data
 *   - file: array of file paths in format "field:path" or objects {filename, filePath}
 * @param {string} dbType - "recent" or undefined (main DB)
 * @returns {object} - The API object saved
 */

import { generateId, loadDB, saveDB, loadRecent, saveRecent } from '../utils/storage.js';
import jsonParser from '../utils/jsonParser.js';
import logger from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

export default async (method, url, options, dbType) => {
    try {
        if (!method || !url) {
            logger.error("HTTP method and URL are required.");
            process.exit(1);
        }

        // Load the DB (recent or main)
        const db = dbType === "recent" ? await loadRecent() : await loadDB();
        const now = new Date().toISOString();

        let requestData = options.data || {};
        let filePaths = [];

        // Handle multipart requests with files and JSON data
        if (options.multipart) {
            if (options.file?.length > 0) {
                if (!["post", "put", "patch"].includes(method.toLowerCase())) {
                    logger.warn("Files can only be sent on POST, PUT, PATCH methods");
                    process.exit(1);
                }

                for (const f of options.file) {
                    let filename, file;
                    if (typeof f === "string") {
                        [filename, file] = f.split(":");
                    } else if (typeof f === "object" && f.filename && f.filePath) {
                        filename = f.filename;
                        file = f.filePath;
                    } else {
                        logger.error("Invalid file format: " + JSON.stringify(f));
                        process.exit(1);
                    }

                    if (file.startsWith("http://") || file.startsWith("https://")) {
                        logger.error("Remote URLs are not allowed for files.");
                        process.exit(1);
                    }

                    const filePath = path.resolve(file);
                    if (!fs.existsSync(filePath)) {
                        logger.error("File does not exist: " + filePath);
                        process.exit(1);
                    }

                    filePaths.push({ filename, filePath });
                }
            }
        }

        // Parse JSON data if provided as string
        if (requestData && typeof requestData === "string") {
            try {
                requestData = jsonParser(requestData);
            } catch (err) {
                logger.error("Invalid JSON provided for --data (-d)");
                process.exit(1);
            }
        }

        // Parse query params into JSON data
        let queryParams = options.query || {};
        if (queryParams && typeof queryParams === "string") {
            try {
                queryParams = jsonParser(queryParams);
            } catch (err) {
                logger.error("Invalid JSON provided for query (-q)");
                process.exit(1);
            }
        }

        // Prepare headers
        let requestHeader = {};
        try {
            const userHeaders = options.header
                ? (typeof options.header === 'string' ? jsonParser(options.header) : options.header)
                : {};

            if (options.encoded) {
                requestHeader = { "Content-Type": "application/x-www-form-urlencoded", ...userHeaders };
            } else if (options.multipart) {
                requestHeader = { ...userHeaders }; // FormData sets Content-Type automatically
            } else {
                requestHeader = { "Content-Type": "application/json", ...userHeaders };
            }
        } catch (err) {
            logger.error("Invalid JSON provided for header (-h)");
            process.exit(1);
        }

        // Create API object to save
        const api = {
            id: generateId(),
            method: method.trim().toLowerCase(),
            url: url.trim(),
            data: requestData || {},
            header: requestHeader || {},
            query: queryParams || {},
            category: options.category || '',
            encoded: options.encoded || false,
            file: filePaths,
            multipart: options.multipart || false,
            createdAt: now,
            updatedAt: null,
            createdOptions: options // store original CLI options for later use
        };

        // Save to DB
        db.apis = db.apis || [];
        db.apis.unshift(api);

        if (dbType === "recent") {
            if (db.apis.length > 10) db.apis = db.apis.slice(0, 10); // keep only 10 recent APIs
            await saveRecent(db);
            logger.success(">> API saved in recents\n");
            return api;
        }

        await saveDB(db);
        logger.success(">> API saved successfully\n");
        return api;

    } catch (e) {
        logger.error("An error occurred while saving API:", e);
        process.exit(1);
    }
};
