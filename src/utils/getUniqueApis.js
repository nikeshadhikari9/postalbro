/**
 * getUniqueApis.js
 *
 * Returns a list of unique APIs from recent and saved arrays.
 * Uniqueness is determined by full request details: method, URL, data, query, header, and files.
 *
 * @param {Array} recentApis - Array of recent API objects from DB
 * @param {Array} savedApis - Array of saved API objects from DB
 * @param {string} [category=''] - Optional category filter
 * @returns {Array} List of unique API objects: { method, url, createdOptions }
 */

import path from 'path';

export const getUniqueApis = (recentApis, savedApis, category = '') => {
    if (!Array.isArray(recentApis) || !Array.isArray(savedApis)) {
        throw new TypeError('recentApis and savedApis must be arrays.');
    }

    const apis = [];

    /**
     * Normalize file array for comparison
     * @param {Array} files 
     * @returns {Array} Normalized and sorted files array
     */
    const normalizeFileArray = (files = []) => {
        return files
            .map(f => ({
                filename: f.filename,
                filePath: path.normalize(f.filePath) // normalize slashes
            }))
            .sort((a, b) => a.filename.localeCompare(b.filename)); // order doesn't matter
    };

    /**
     * Check if two APIs are identical
     * @param {Object} a 
     * @param {Object} b 
     * @returns {boolean}
     */
    const isSameApi = (a, b) => {
        try {
            return (
                a.method === b.method &&
                a.url === b.url &&
                JSON.stringify(a.data || {}) === JSON.stringify(b.data || {}) &&
                JSON.stringify(a.query || {}) === JSON.stringify(b.query || {}) &&
                JSON.stringify(a.header || {}) === JSON.stringify(b.header || {}) &&
                JSON.stringify(normalizeFileArray(a.file)) === JSON.stringify(normalizeFileArray(b.file))
            );
        } catch (err) {
            console.error('Error comparing APIs:', err);
            return false;
        }
    };

    /**
     * Add API to result array if it is unique
     * @param {Object} apiToAdd 
     */
    const addUniqueApi = (apiToAdd) => {
        if (!apiToAdd || !apiToAdd.method || !apiToAdd.url) return;

        const exists = apis.some(a => isSameApi(a, apiToAdd));
        if (!exists) {
            apis.push({
                method: apiToAdd.method,
                url: apiToAdd.url,
                createdOptions: {
                    data: apiToAdd.data && apiToAdd.data !== "" ? apiToAdd.data : {},
                    query: apiToAdd.query && apiToAdd.query !== "" ? apiToAdd.query : {},
                    header: apiToAdd.header && apiToAdd.header !== "" ? apiToAdd.header : {},
                    file: apiToAdd.file || [],
                    multipart: apiToAdd.multipart || false,
                    category: apiToAdd.category || '',
                }
            });
        }
    };

    // Process recent APIs
    recentApis
        .filter(a => !category || a.category === category)
        .forEach(api => addUniqueApi(api));

    // Process saved APIs
    savedApis
        .filter(a => !category || a.category === category)
        .forEach(api => addUniqueApi(api));

    return apis;
};
