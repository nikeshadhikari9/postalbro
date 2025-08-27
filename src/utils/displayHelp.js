import logger from "./logger.js";

// Display welcome message
const displayWelcomeMessage = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                                  POSTALBRO CLI                                 │");
    logger.message("│        Test, manage, and organize your APIs easily from the terminal.          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Quick Start:");
    logger.warn('  • Test an API:    postalbro test GET https://api.example.com');
    logger.warn("  • Save an API:    postalbro save POST https://api.example.com/data -d '{\"key\":\"value\"}'");
    logger.warn("  • List APIs:      postalbro list --all");
    logger.warn("  • Run saved API:  postalbro run --id \"9804\"");
    logger.warn("");
    logger.warn("Need help? Run 'postalbro --help' for detailed usage information.");
    logger.message("For detailed documentation, visit: https://github.com/nikeshadhikari9/postalbro");
    logger.message("Author: Nikesh Adhikari\n")
};
// Custom help function for Postalbro
const displayCustomHelp = () => {
    logger.message("┌───────────────────────────────────────────────────────────────┐");
    logger.message("│                      POSTALBRO CLI HELPLINE                   │");
    logger.message("└───────────────────────────────────────────────────────────────┘\n");

    logger.response("Usage:");
    logger.info("  postalbro [command] [options]\n");

    logger.response("Commands:");
    logger.info("  test <method> <url>        Test an API endpoint");
    logger.info("  save <method> <url>        Save an API configuration for later");
    logger.info("  run                        Run saved APIs (by id or category)");
    logger.info("  detail                     Display details of saved APIs (by id or category)");
    logger.info("  list                       List saved APIs (with filters)");
    logger.info("  delete                     Delete saved APIs (by id, category, or all)");
    logger.info("  recent                     Show recently called APIs");
    logger.info("  search <query>             Search APIs by URL, method, or category\n");

    logger.response("Options:");
    logger.info("  -V, --version                 Show Postalbro version");
    logger.info("  -h, --help                    Display this help message");
    logger.info("  -i, --id <id>                 Specify API id (for run/delete commands)");
    logger.info("  -c, --category <category>     Specify API category");
    logger.info("  -a, --all                     Apply command to all APIs (run/list/delete)");
    logger.info("  -d, --data <data>             Request payload for POST/PUT/PATCH");
    logger.info("  -q, --query <query>           Query parameters for the request");
    logger.info("  -H, --header <header>         Custom headers for the request");
    logger.info("  -f, --file <name:path>        Path of the file (only while multipart enable)");
    logger.info("  -m, --multipart               Enable multipart/form-data request");
    logger.info("  -e, --encoded                 Enable URL-encoded form request\n");

    logger.response("Examples:");
    logger.info("  postalbro test GET http://api.example.com/users");
    logger.info("  postalbro test POST http://localhost:2025/api/auth/login --multipart --file \"./nikesh-resume.png\" --data '{\"name\":\"Nikesh\"}'");
    logger.info("  postalbro save POST http://localhost:2025/data -d '{\"name\":\"Nikesh\"}'");
    logger.info("  postalbro run --id 1a2b");
    logger.info("  postalbro run --category users");
    logger.info("  postalbro detail --category users");
    logger.info("  postalbro list --all");
    logger.info("  postalbro delete --category temp");
    logger.info("  postalbro search \"users\"\n");

    logger.response("Tips:");
    logger.info("  • Use categories to organize APIs for easier management.");
    logger.info("  • Try > postalbro [command] --help (for specific command options and usage)");
    logger.info("  • Recent commands store the last 10 API calls for quick reruns.");
    logger.info("  • Combine options for powerful filtering and automation.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};
// --------------------------
// TEST Command Help
// --------------------------
const displayTestHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                           POSTALBRO TEST COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  The 'test' command is used to quickly send a request to an API endpoint and");
    logger.info("  view its response. It works just like Postman or curl, but directly in your terminal.");
    logger.info("  Supports headers, request body, query params, multipart upload, and more.\n");

    logger.response("Usage:");
    logger.info("  postalbro test <method> <url> [options]\n");

    logger.response("Arguments:");
    logger.info("  method                  HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)");
    logger.info("  url                     API endpoint URL\n");

    logger.response("Options:");
    logger.info("  -d, --data <data>                JSON string request body");
    logger.info("  -H, --header <header>            Headers for authorization or content-type");
    logger.info("  -q, --query <query>              Query parameters (format: key=value&key2=value2)");
    logger.info("  -e, --encoded (true, false)      Use URL Encoded data format");
    logger.info("  -c, --category <category>        Save this test temporarily under a category for rerun");
    logger.info("  -m, --multipart (true, false)    Use Multipart form-data format");
    logger.info("  -f, --file <name:path>           Attach files for upload (can be repeated)\n");

    logger.response("Examples:");
    logger.info("  postalbro test GET https://api.example.com/users");
    logger.info("  postalbro test POST https://api.example.com/data -d '{\"name\":\"John\"}' -H \'{\"Content-Type\":\"application/json\"}\'");
    logger.info("  postalbro test PUT https://api.example.com/user/1 -e -q '{\"param1\":\"value1\",\"param2\":\"value2\"}'");
    logger.info("  postalbro test POST https://localhost:2025/api/user/upload -m -f \"resumeImage:./resume.pdf\"\n");

    logger.response("Features:");
    logger.info("  • Instantly test API endpoints from terminal.");
    logger.info("  • Debug headers, body, and query params in real time.");
    logger.info("  • Upload files with multipart or send x-www-form-urlencoded data.");
    logger.info("  • Save under categories for reuse with 'run' or 'list'.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// SAVE Command Help
// --------------------------
const displaySaveHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                           POSTALBRO SAVE COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  The 'save' command allows you to store an API configuration for later use.");
    logger.info("  Saved APIs can be grouped under categories, making it easy to organize and rerun.\n");

    logger.response("Usage:");
    logger.info("  postalbro save <method> <url> [options]\n");

    logger.response("Arguments:");
    logger.info("  method                  HTTP method (GET, POST, PUT, DELETE, etc.)");
    logger.info("  url                     API endpoint URL\n");

    logger.response("Options:");
    logger.info("  -d, --data <data>               JSON string request body");
    logger.info("  -H, --header <header>           Headers (e.g. Authorization, Content-Type)");
    logger.info("  -q, --query <query>             Query params (key=value&key2=value2)");
    logger.info("  -c, --category <category>       Save API under a category");
    logger.info("  -e, --encoded                   Save with URL Encoded data format");
    logger.info("  -m, --multipart                 Save with Multipart form-data format");
    logger.info("  -f, --file <name:path>          Attach file paths for upload\n");

    logger.response("Examples:");
    logger.info("  postalbro save GET https://api.example.com/users -c \"user-apis\"");
    logger.info("  postalbro save POST https://api.example.com/data -d '{\"name\":\"John\"}' -H '{\"Authorization\":\"Bearer token\"}'\n");

    logger.response("Features:");
    logger.info("  • Save once, reuse anytime without retyping.");
    logger.info("  • Organize APIs with categories (auth, users, products, etc).");
    logger.info("  • Works seamlessly with 'run', 'list', 'delete', and 'recent'.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// RUN Command Help
// --------------------------
const displayRunHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                           POSTALBRO RUN COMMAND HELP                           │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Run one or more previously saved APIs. Perfect for automated testing or");
    logger.info("  running a full workflow of related endpoints.\n");

    logger.response("Usage:");
    logger.info("  postalbro run [options]\n");

    logger.response("Options:");
    logger.info("  -i, --id <id>                 Run a single API by its ID");
    logger.info("  -c, --category <category>     Run all APIs in a category\n");

    logger.response("Examples:");
    logger.info("  postalbro run -i ab12");
    logger.info("  postalbro run -c auth-apis\n");

    logger.response("Features:");
    logger.info("  • Automate testing of multiple APIs at once.");
    logger.info("  • Combine with categories for running grouped workflows.");
    logger.info("  • Great for regression or smoke testing APIs.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// DETAIL Command Help
// --------------------------
const displayDetailHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                         POSTALBRO DETAIL COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Display details of one or more previously saved APIs based on category or just id.\n");

    logger.response("Usage:");
    logger.info("  postalbro detail [options]\n");

    logger.response("Options:");
    logger.info("  -i, --id <id>                 Diaplay details of a single API by its ID");
    logger.info("  -c, --category <category>     Diaplay details of API(s) by their category\n");

    logger.response("Examples:");
    logger.info("  postalbro detail -i ab12");
    logger.info("  postalbro detail -c auth-apis\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// LIST Command Help
// --------------------------
const displayListHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                          POSTALBRO LIST COMMAND HELP                           │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Display all APIs you have saved. Apply filters by category, method, or host");
    logger.info("  to quickly find what you need.\n");

    logger.response("Usage:");
    logger.info("  postalbro list [options]\n");

    logger.response("Options:");
    logger.info("  -c, --category <category>     List APIs from a category");
    logger.info("  -m, --method <method>         List APIs by HTTP method");
    logger.info("  --host <host>                 List APIs by host/domain");
    logger.info("  -a, --all                     Show all saved APIs\n");

    logger.response("Examples:");
    logger.info("  postalbro list");
    logger.info("  postalbro list -c user-apis");
    logger.info("  postalbro list -m POST");
    logger.info("  postalbro list --host api.example.com\n");

    logger.response("Features:");
    logger.info("  • Easily browse saved APIs with flexible filters.");
    logger.info("  • Combine multiple filters for precision (category + method + host).");
    logger.info("  • Works great with 'search' for quick lookups.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// DELETE Command Help
// --------------------------
const displayDeleteHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                         POSTALBRO DELETE COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Remove APIs you no longer need. Delete by ID, category, or wipe all saved APIs.");
    logger.info("  Includes a safe confirmation step unless you use --yes.\n");

    logger.response("Usage:");
    logger.info("  postalbro delete [options]\n");

    logger.response("Options:");
    logger.info("  -i, --id <id>                  Delete a single API by ID");
    logger.info("  -c, --category <category>      Delete all APIs in a category");
    logger.info("  -a, --all                      Delete all saved APIs");
    logger.info("  -y, --yes                      Skip confirmation prompt\n");

    logger.response("Examples:");
    logger.info("  postalbro delete -i ab12");
    logger.info("  postalbro delete -c temp");
    logger.info("  postalbro delete -a -y\n");

    logger.response("Features:");
    logger.info("  • Keep your saved APIs clean and organized.");
    logger.info("  • Use categories to bulk delete groups of APIs.");
    logger.info("  • 'Are you sure?' prompt prevents accidental data loss.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// RECENT Command Help
// --------------------------
const displayRecentHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                         POSTALBRO RECENT COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Show recently tested or executed APIs. Quickly rerun recent calls without");
    logger.info("  retyping the entire request.\n");

    logger.response("Usage:");
    logger.info("  postalbro recent [options]\n");

    logger.response("Options:");
    logger.info("  -c, --category <category>     Show recent APIs from a category");
    logger.info("  -a, --all                     Show full history of recent APIs\n");

    logger.response("Examples:");
    logger.info("  postalbro recent");
    logger.info("  postalbro recent -c auth-apis");
    logger.info("  postalbro recent -a\n");

    logger.response("Features:");
    logger.info("  • Stores last 10 API calls for instant recall.");
    logger.info("  • Great for debugging or retrying failed requests.");
    logger.info("  • Combine with 'test' or 'run' to quickly re-execute.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

// --------------------------
// SEARCH Command Help
// --------------------------
const displaySearchHelp = () => {
    logger.message("┌────────────────────────────────────────────────────────────────────────────────┐");
    logger.message("│                         POSTALBRO SEARCH COMMAND HELP                          │");
    logger.message("└────────────────────────────────────────────────────────────────────────────────┘");
    logger.info("");
    logger.response("Purpose:");
    logger.info("  Perform a fuzzy search across all saved APIs. You can search by method, URL,");
    logger.info("  headers, categories, or any stored metadata.\n");

    logger.response("Usage:");
    logger.info("  postalbro search <query>\n");

    logger.response("Arguments:");
    logger.info("  query                    Search term (matched against name, URL, headers, etc.)\n");

    logger.response("Examples:");
    logger.info("  postalbro search users");
    logger.info("  postalbro search \"Authorization\"");
    logger.info("  postalbro search https://api.example.com\n");

    logger.response("Features:");
    logger.info("  • Fuzzy matching finds APIs even if query is not exact.");
    logger.info("  • Useful for large API collections with many categories.");
    logger.info("  • Combine with 'run' or 'list' after search for workflows.\n");

    logger.response("More info:");
    logger.info("  Documentation & updates: https://github.com/nikeshadhikari9/postalbro\n");
};

export {
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
}
