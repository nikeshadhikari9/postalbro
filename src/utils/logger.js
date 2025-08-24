/**
 * logger.js
 *
 * A simple logging utility for CLI output with color coding using chalk.
 * Provides different log levels: info, success, response, warn, error.
 *
 * Usage:
 *   logger.info("This is an info message");
 *   logger.success("Operation successful");
 *   logger.warn("This is a warning");
 *   logger.error("This is an error message");
 *   logger.response("API response or info");
 */

import chalk from "chalk";

const logger = {
    /**
     * General informational message
     * @param {string} msg
     */
    info: (msg) => console.log(msg),

    /**
     * Success message (green)
     * @param {string} msg
     */
    success: (msg) => console.log(chalk.green(msg)),

    /**
     * Highlighted response output (magenta)
     * @param {string} msg
     */
    response: (msg) => console.log(chalk.magentaBright(msg)),

    /**
     * Warning message (yellow)
     * @param {string} msg
     */
    warn: (msg) => console.warn(chalk.yellow(msg)),

    /**
     * Error message (red)
     * @param {string} msg
     */
    error: (msg) => console.error(chalk.red(msg)),

    /**
     * customized message (blue)
     * @param {string} msg
     */
    message: (msg) => console.error(chalk.blueBright(msg)),

};

export default logger;
