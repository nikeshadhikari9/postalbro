#!/usr/bin/env node
/**
 * postalbro CLI entry point
 * 
 * This file sets up the CLI commands for postalbro, a Postman-like API testing CLI.
 * It handles commands like: test, save, run, list, delete, recent, and search.
 * 
 * Features:
 * - Input validation for method, URL, mutually exclusive options
 * - Proper error handling and exit codes
 * - CLI-wide output configured via a custom logger
 * 
 * No actual API logic is implemented here; all commands delegate to their respective modules.
 */

import { Command } from "commander";
import fs from "fs";
import logger from "./src/utils/logger.js";
import saveCmd from "./src/commands/save.js";
import testCmd from "./src/commands/test.js";
import runCmd from "./src/commands/run.js";
import detailsCmd from "./src/commands/details.js";
import recentCmd from "./src/commands/recent.js";
import searchCmd from "./src/commands/search.js";
import listCmd from "./src/commands/list.js";
import deleteCmd from "./src/commands/delete.js";
import { setupStore } from "./src/utils/storage.js";
import {
    displayCustomHelp,
    displayDeleteHelp,
    displayListHelp,
    displayRecentHelp,
    displayRunHelp,
    displayDetailHelp,
    displaySaveHelp,
    displaySearchHelp,
    displayTestHelp,
    displayWelcomeMessage,
} from './src/utils/displayHelp.js'

// Read package.json to get CLI version
const pkg = JSON.parse(fs.readFileSync(new URL("./package.json", import.meta.url)));

(async () => {
    try {
        const args = process.argv;

        // Pre-handle top-level help
        if (args.length === 2) {
            displayWelcomeMessage();
            process.exit(0);
        }

        // Handle help for each command
        if (args.includes("--help") || args.includes("-h")) {
            if (args[2] === "test") {
                displayTestHelp();
                process.exit(0);
            }
            else if (args[2] === "save") {
                displaySaveHelp();
                process.exit(0);
            }
            else if (args[2] === "run") {
                displayRunHelp();
                process.exit(0);
            }
            else if (args[2] === "detail") {
                displayDetailHelp();
                process.exit(0);
            }
            else if (args[2] === "search") {
                displaySearchHelp();
                process.exit(0);
            }
            else if (args[2] === "list") {
                displayListHelp();
                process.exit(0);
            }
            else if (args[2] === "delete") {
                displayDeleteHelp();
                process.exit(0);
            }
            else if (args[2] === "recent") {
                displayRecentHelp();
                process.exit(0);
            }
            else {
                displayCustomHelp();
                process.exit(0);
            }
        }

        await setupStore();

        const program = new Command();

        program
            .name("postalbro")
            .description("Test, manage, and organize your APIs easily from the terminal.")
            .version(pkg.version)

        // Disable built-in help after configuring exitOverride
        program.helpOption(false);
        program.helpCommand(false);

        // Override Commander's error handling to show custom help for unknown options
        program.exitOverride((err) => {
            if (err.code === 'commander.unknownOption') {
                const unknownOption = err.message.match(/'([^']+)'/)?.[1] || 'unknown';

                // Show command-specific help based on which command was being executed
                if (process.argv[2] === 'test') {
                    logger.error(`Error: Unknown option '${unknownOption}' for test command.`);
                    displayTestHelp();
                } else if (process.argv[2] === 'save') {
                    logger.error(`Error: Unknown option '${unknownOption}' for save command.`);
                    displaySaveHelp();
                } else if (process.argv[2] === 'run') {
                    logger.error(`Error: Unknown option '${unknownOption}' for run command.`);
                    displayRunHelp();
                } else if (process.argv[2] === 'list') {
                    logger.error(`Error: Unknown option '${unknownOption}' for list command.`);
                    displayListHelp();
                } else if (process.argv[2] === 'delete') {
                    logger.error(`Error: Unknown option '${unknownOption}' for delete command.`);
                    displayDeleteHelp();
                } else if (process.argv[2] === 'recent') {
                    logger.error(`Error: Unknown option '${unknownOption}' for recent command.`);
                    displayRecentHelp();
                } else if (process.argv[2] === 'search') {
                    logger.error(`Error: Unknown option '${unknownOption}' for search command.`);
                    displaySearchHelp();
                } else {
                    logger.error(`Error: Unknown option '${unknownOption}'.`);
                    displayCustomHelp();
                }
                process.exit(1);
            }
            // For other errors, re-throw them
            throw err;
        });

        program.configureOutput({
            writeOut: (str) => logger.info(str.trim()),
            writeErr: (str) => logger.info(str.trim()),
            outputError: (str) => logger.error(str.trim())

        });



        /**
         * Utility: Ensure mutually exclusive flags are not used together
         * @param {object} options - Commander parsed options
         * @param  {...string} flags - List of option keys that cannot co-exist
         */
        const checkMutuallyExclusive = (options, ...flags) => {
            const count = flags.filter(flag => options[flag]).length;
            if (count > 1) {
                logger.error(`Options ${flags.join(" and ")} cannot be used together.`);
                process.exit(1);
            }
        };

        // ----------------------
        // Define CLI Commands
        // ----------------------

        // Test API command
        const testCommand = program
            .command("test <method> <url>")
            .description("Test an API")
            .option("-d, --data <data>", "JSON string request body", "")
            .option("-H, --header <header>", "Headers for authorization", "")
            .option("-q, --query <query>", "Query to be sent through API", "")
            .option("-e, --encoded", "URL Encoded data format", false)
            .option("-c, --category <category>", "Category for similar host API", "")
            .option("-m, --multipart", "Multipart form-data format", false)
            .option("-f, --file <filename>:<path>", "Files path to send (one file per -f option)", (value, previous) => previous ? previous.concat(value) : [value], [])
            .action((method, url, options, command) => {
                if (!method || !url) {
                    logger.error("Method and URL are required.");
                    command.help();
                }
                checkMutuallyExclusive(options, "encoded", "multipart");

                // Call the testCmd handler
                try {
                    testCmd(method, url, options);
                } catch (err) {
                    logger.error("Error executing test command:", err);
                    process.exit(1);
                }
            });
        testCommand.helpOption(false);
        testCommand.on('--help', () => {
            displayTestHelp();
            process.exit(0);
        });


        // Save API command
        const saveCommand = program
            .command("save <method> <url>")
            .description("Save API for later usage")
            .option("-d, --data <data>", "JSON string request body", "")
            .option("-H, --header <header>", "Headers for authorization", "")
            .option("-q, --query <query>", "Query to be sent through API", "")
            .option("-c, --category <category>", "Category for similar host API", "")
            .option("-e, --encoded", "URL Encoded data format", false)
            .option("-m, --multipart", "Multipart form-data format", false)
            .option("-f, --file <filename>:<path>", "Files path to send (one file per -f option)", (value, previous) => previous ? previous.concat(value) : [value], [])
            .action((method, url, options) => {
                checkMutuallyExclusive(options, "encoded", "multipart");
                try {
                    saveCmd(method, url, options);
                } catch (err) {
                    logger.error("Error executing save command:", err);
                    process.exit(1);
                }
            });
        saveCommand.helpOption(false);
        saveCommand.on('--help', () => {
            displaySaveHelp();
            process.exit(0);
        });


        // Run saved API command
        const runCommand = program
            .command("run")
            .description("Run saved APIs")
            .option("-i, --id <id>", "Id of API for single request", "")
            .option("-c, --category <category>", "Category for similar host API", "")
            .action(async (options) => {
                try {
                    await runCmd(options);
                } catch (err) {
                    logger.error("Error executing run command:", err);
                    process.exit(1);
                }
            });
        runCommand.helpOption(false);
        runCommand.on('--help', () => {
            displayRunHelp();
            process.exit(0);
        });

        // show details of an api
        const detailCommand = program
            .command("detail")
            .description("detail of saved API")
            .option("-i, --id <id>", "Id of API for single request", "")
            .option("-c, --category <category>", "Category for similar host API", "")
            .action(async (options) => {
                try {
                    await detailsCmd(options);
                } catch (err) {
                    logger.error("Error executing detail command:", err);
                    process.exit(1);
                }
            });
        detailCommand.helpOption(false);
        detailCommand.on('--help', () => {
            displayDetailHelp();
            process.exit(0);
        });

        // List saved APIs
        const listCommand = program
            .command("list")
            .description("List all saved APIs")
            .option("-c, --category <category>", "Category for similar host API", "")
            .option("-m, --method <method>", "List APIs of certain method only", "")
            .option("--host <host>", "List APIs of certain host only", "")
            .option("-a, --all", "List all saved APIs", false)
            .action(async (options) => {
                try {
                    await listCmd(options);
                } catch (err) {
                    logger.error("Error executing list command:", err);
                    process.exit(1);
                }
            });
        listCommand.helpOption(false);
        listCommand.on('--help', () => {
            displayListHelp();
            process.exit(0);
        });

        // Delete saved APIs
        const deleteCommand = program
            .command("delete")
            .description("Delete saved APIs")
            .option("-c, --category <category>", "Category for similar host API", "")
            .option("-i, --id <id>", "Delete API by id", "")
            .option("-a, --all", "Delete all saved APIs", false)
            .option("-r, --recent", "Delete all recent tested APIs", false)
            .option("-y, --yes", "Skip confirmation prompt", false)
            .action(async (options) => {
                try {
                    await deleteCmd(options);
                } catch (err) {
                    logger.error("Error executing delete command:", err);
                    process.exit(1);
                }
            });
        deleteCommand.helpOption(false);
        deleteCommand.on('--help', () => {
            displayDeleteHelp();
            process.exit(0);
        });

        // Show recently used APIs
        const recentCommand = program
            .command("recent")
            .description("Show recently called APIs")
            .option("-c, --category <category>", "Category for similar host API", "")
            .option("-a, --all", "Show all recent APIs", false)
            .action(async (options) => {
                try {
                    await recentCmd(options);
                } catch (err) {
                    logger.error("Error executing recent command:", err);
                    process.exit(1);
                }
            });
        recentCommand.helpOption(false);
        recentCommand.on('--help', () => {
            displayRecentHelp();
            process.exit(0);
        });

        // Search APIs
        const searchCommand = program
            .command("search <query>")
            .description("Fuzzy search APIs by query")
            .action(async (query) => {
                try {
                    await searchCmd(query);
                } catch (err) {
                    logger.error("Error executing search command:", err);
                    process.exit(1);
                }
            });
        searchCommand.helpOption(false);
        searchCommand.on('--help', () => {
            displaySearchHelp();
            process.exit(0);
        });

        // Parse command line arguments
        await program.parseAsync(process.argv);

    } catch (error) {
        logger.error("Fatal error initializing CLI:", error);
        process.exit(1);
    }
})();
