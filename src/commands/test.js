/**
 * test.js
 *
 * Tests an API by sending an HTTP request.
 * Automatically saves the API to the recent list.
 *
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} url - Full API URL
 * @param {object} options - Options object including data, headers, query, encoded, multipart, file
 * @returns {Promise<void>} - Logs responses and errors; exits process on failure
 */

import httpRequest from '../utils/http.js';
import logger from '../utils/logger.js';
import saveCmd from './save.js';

const testCmd = async (method, url, options) => {
    try {
        // Validate method and URL
        if (!method || typeof method !== 'string') {
            logger.error('HTTP method is required and must be a string.');
            process.exit(1);
        }
        if (!url || typeof url !== 'string') {
            logger.error('API URL is required and must be a string.');
            process.exit(1);
        }

        // Save API to recent storage
        const api = await saveCmd(method, url, options, 'recent');

        logger.response(`\nTesting API: ${api.method.toUpperCase()} ${api.url}\n`);

        // Only send `data` if it is a non-empty object
        const dataToSend = api.data && Object.keys(api.data).length > 0 ? api.data : undefined;

        // Perform HTTP request
        await httpRequest(
            api.method,
            api.url,
            dataToSend,
            api.header,
            api.query,
            api.encoded,
            api.multipart,
            api.file
        );

    } catch (err) {
        if (err instanceof Error) {
            logger.error('Error Testing API:', err.message);
        } else {
            logger.error('Unknown error occurred while testing API:', err);
        }
        process.exit(1);
    }
};

export default testCmd;
