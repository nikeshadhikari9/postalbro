/**
 * storage.js
 *
 * Utilities for persistent storage of APIs and recent API calls.
 * Stores data in a hidden ".postalbro" folder in the user's home directory.
 */

import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const fsp = fs.promises;

// ---------------------- Constants ----------------------
const DATA_DIR = path.join(os.homedir(), ".postalbro"); // folder to store DB
const DB_FILE = path.join(DATA_DIR, "db.json");          // main API storage
const RECENT_FILE = path.join(DATA_DIR, "recent.json");  // recent APIs

// ---------------------- ID Generator ----------------------
/**
 * Generate a random hex ID for APIs
 * @returns {string} 4-character random ID
 */
function generateId() {
    return crypto.randomBytes(2).toString("hex");
}

// ---------------------- Setup Storage ----------------------
/**
 * Ensure storage folder and JSON files exist
 */
async function setupStore() {
    await fsp.mkdir(DATA_DIR, { recursive: true });

    try {
        await fsp.access(DB_FILE, fs.constants.F_OK);
        await fsp.access(RECENT_FILE, fs.constants.F_OK);
    } catch (err) {
        const initialData = {
            apis: [],
            createdAt: new Date().toISOString(),
        };
        await fsp.writeFile(DB_FILE, JSON.stringify(initialData, null, 2));
        await fsp.writeFile(RECENT_FILE, JSON.stringify(initialData, null, 2));
    }
}

// ---------------------- DB Operations ----------------------
/**
 * Load all saved APIs
 * @returns {Promise<Object>} Parsed DB content
 */
async function loadDB() {
    try {
        const data = await fsp.readFile(DB_FILE, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Failed to read DB file: " + err.message);
    }
}

/**
 * Save all APIs to DB
 * @param {Object} data - Object containing `apis` array
 */
async function saveDB(data) {
    try {
        await fsp.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        throw new Error("Failed to save DB file: " + err.message);
    }
}

// ---------------------- Recent APIs ----------------------
/**
 * Load recent APIs (last 10)
 * @returns {Promise<Object>} Parsed recent API data
 */
async function loadRecent() {
    try {
        const data = await fsp.readFile(RECENT_FILE, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return { apis: [], createdAt: new Date().toISOString() };
    }
}

/**
 * Save a recent API
 * @param {Object} data - API object or object containing `apis` array
 */
async function saveRecent(data) {
    if (data.apis && data.apis.length === 0) {
        const saveObj = data;
        try {
            await fsp.writeFile(RECENT_FILE, JSON.stringify(saveObj, null, 2));
        } catch (err) {
            throw new Error("Failed to save recent APIs: " + err.message);
        }

    } else {
        let recentData = [];

        try {
            const fileContent = await fsp.readFile(RECENT_FILE, "utf-8");
            recentData = JSON.parse(fileContent).apis || [];
        } catch (err) {
            recentData = [];
        }

        // Always add the latest API at the front
        const apiToSave = data.apis ? data.apis[0] : data;
        recentData.unshift(apiToSave);

        // Keep only latest 10 entries
        if (recentData.length > 10) recentData = recentData.slice(0, 10);

        const saveObj = { apis: recentData, createdAt: new Date().toISOString() };
        try {
            await fsp.writeFile(RECENT_FILE, JSON.stringify(saveObj, null, 2));
        } catch (err) {
            throw new Error("Failed to save recent APIs: " + err.message);
        }
    }

}

// ---------------------- Exports ----------------------
export {
    DATA_DIR,
    DB_FILE,
    RECENT_FILE,
    loadRecent,
    saveRecent,
    generateId,
    setupStore,
    loadDB,
    saveDB,
};
