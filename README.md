# postalbro CLI

[![npm version](https://img.shields.io/npm/v/postalbro)](https://www.npmjs.com/package/postalbro/latest)  
[![License](https://img.shields.io/npm/l/postalbro)](LICENSE)

**postalbro** is a terminal-based, Postman-inspired CLI for testing, managing, and organizing your APIs quickly and efficiently. With `postalbro`, you can test endpoints, save API configurations, run saved APIs, and manage them without ever leaving the terminal. It supports headers, query parameters, request bodies, multipart uploads, categories, and more.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Why postalbro?](#why-postalbro)
3. [Features](#features)
4. [Installation](#installation)
5. [Getting Started](#getting-started)
6. [Commands](#commands)
   - [Test](#test)
   - [Save](#save)
   - [Run](#run)
   - [List](#list)
   - [Delete](#delete)
   - [Recent](#recent)
   - [Search](#search)
7. [Global Options](#global-options)
8. [Advanced Usage](#advanced-usage)
9. [Examples](#examples)
10. [Tips & Best Practices](#tips--best-practices)
11. [License](#license)
12. [Author](#author)
13. [Keywords](#keywords)

---

## Introduction

`postalbro` allows developers and testers to interact with APIs in a fast, reproducible way directly from the terminal. Think of it as **Postman in your terminal**, lightweight, scriptable, and designed to simplify your workflow.

---

## Why postalbro?

- **Speed**: Interact with APIs faster than ever without opening a GUI.
- **Convenience**: Manage and test APIs directly from the command line.
- **Flexibility**: Supports all major HTTP methods, including custom headers, multipart uploads, and more.
- **Automation**: Seamlessly integrate with CI/CD pipelines or run API tests as part of your daily development cycle.
- **Simplicity**: Minimal setup and easy to use. Focus on APIs, not configurations.

Postalbro is designed to improve productivity and efficiency when working with APIs. Whether you're developing an app or testing an API, Postalbro has you covered—without interrupting your workflow.

---

## Features

- **Test API Endpoints**: Supports GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS.
- **Save API Calls**: Store reusable API configurations under categories for future use.
- **Run APIs**: Execute saved APIs individually or by category.
- **API Management**: List, search, and delete saved APIs easily.
- **Custom Headers & Body**: Send requests with JSON, multipart, or URL-encoded bodies, along with custom headers.
- **File Uploads**: Handle file uploads with multipart form-data.
- **Categories**: Organize APIs into categories for better structure.
- **Recent APIs**: Quickly rerun the last 10 tested APIs.
- **Fuzzy Search**: Easily search for saved APIs using keywords or URLs.
- **Terminal-based**: No GUI required; works seamlessly in any shell.

---

## Installation

To install `postalbro` globally via NPM, run the following:

```bash
npm install postalbro
```

### Verify Installation:

```bash
postalbro --version
```

---

## Getting Started

After installing, you can start using Postalbro right away by typing:

```bash
postalbro
```

You will see a welcome message with quick-start instructions. If you want to test a single API or configure your workflow, use the `postalbro` commands described below.

---

## Commands

### Test

Send API requests directly from the terminal.

```bash
postalbro test <method> <url> [options]
```

Arguments:

- `method`: HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- `url`: API endpoint URL

Options:

- `-d, --data <data>`: JSON request body
- `-H, --header <header>`: Request headers
- `-q, --query <query>`: Query parameters (`"key":"value","key2":"value2"`)
- `-e, --encoded`: URL-encoded data format
- `-m, --multipart`: Multipart form-data format
- `-f, --file <name:path>`: Attach files for upload
- `-c, --category <category>`: Save temporarily under a category

### Save

Store an API configuration for reuse.

```bash
postalbro save <method> <url> [options]
```

Arguments:

- `method`: HTTP method (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- `url`: API endpoint URL

Options:

- `-d, --data <data>`: JSON request body
- `-H, --header <header>`: Request headers
- `-q, --query <query>`: Query parameters (`"key":"value","key2":"value2"`)
- `-e, --encoded`: URL-encoded data format
- `-m, --multipart`: Multipart form-data format
- `-f, --file <name:path>`: Attach files for upload
- `-c, --category <category>`: Save temporarily under a category

### Run

Execute saved APIs.

```bash
postalbro run [options]
```

Options:

- `-i, --id <id>`: Run a single API by ID
- `-c, --category <category>`: Run all APIs in a category

### List

View saved APIs with optional filters.

```bash
postalbro list [options]
```

Options:

- `-c, --category <category>`: List APIs by category
- `-m, --method <method>`: Filter by HTTP method
- `--host <host>`: Filter by host
- `-a, --all`: Show all saved APIs

### Delete

Remove saved APIs.

```bash
postalbro delete [options]
```

Options:

- `-i, --id <id>`: Delete API by ID
- `-c, --category <category>`: Delete all APIs in a category
- `-a, --all`: Delete all saved APIs
- `-r, --recent`: Delete all recently tested APIs
- `-y, --yes`: Skip confirmation prompt

### Recent

Show the last 10 tested APIs.

```bash
postalbro recent [options]
```

Options:

- `-c, --category <category>`: Filter recent by category
- `-a, --all`: Show all recent APIs

### Search

Fuzzy search across all saved APIs.

```bash
postalbro search <query>
```

Arguments:

- `query`: Search text (e.g., name, URL, headers, or category)

---

## Global Options

- `-V, --version`: Show version of `postalbro`
- `-h, --help`: Show help for any command

---

## Advanced Usage

### Using Environment Variables for API Secrets

Instead of hardcoding sensitive information like API keys, you can use environment variables. For example:

```bash
postalbro test POST https://api.example.com/auth -d '{"key":"$API_KEY"}'
```

Here, `$API_KEY` will be replaced by the value of your environment variable.

### Automating API Tests in CI/CD

You can use `postalbro` in your CI/CD pipeline to test APIs automatically after a build or deployment:

```bash
# Example: In your pipeline script
postalbro run --category "test-apis"
```

### Advanced Search with Filters

Search across multiple parameters like method, host, and category to fine-tune your API management:

```bash
postalbro search "login" --method POST --host api.example.com
```

---

## Examples

Here are some example commands to get you started:

- **Test a GET endpoint**:

  ```bash
  postalbro test GET https://api.example.com/users
  ```

- **Test POST with JSON body and header**:

  ```bash
  postalbro test POST http://localhost:2025/api/login -d '{"username":"user","password":"pass"}' -H '{"Authorization":"Bearer TOKEN782BFGU4"}'
  ```

- **Test file upload**:

  ```bash
  postalbro test POST http://localhost:2025/api/upload -m -f "resume:./resume.pdf"
  ```

- **Save an API for later**:

  ```bash
  postalbro save POST http://localhost:2025/data -d '{"name":"Nikesh"}' -c "users"
  ```

- **Run a saved API by ID**:

  ```bash
  postalbro run --id 1a2b
  ```

- **Run all APIs in a category**:

  ```bash
  postalbro run --category auth-apis
  ```

- **List all APIs**:

  ```bash
  postalbro list --all
  ```

- **Delete all APIs in a category**:

  ```bash
  postalbro delete --category temp -y
  ```

- **Search for APIs**:
  ```bash
  postalbro search "users"
  ```

---

## Tips & Best Practices

- **Use Categories**: Group APIs by purpose (e.g., `auth-apis`, `test-apis`) for better organization.
- **Combine Commands**: You can chain commands for more complex workflows (e.g., testing and saving in one step).
- **Recent APIs**: Use the `recent` command to quickly rerun the last 10 tested APIs, perfect for debugging.
- **Check Help**: Don’t forget to use `postalbro <command> --help` for detailed information on each command.

---

## License

This project is licensed under the MIT License. See LICENSE for details.

---

## Author

[Nikesh Adhikari](https://github.com/nikeshadhikari9)

### Keywords

[postalbro](https://www.npmjs.com/search?q=postalbro) [api-testing](https://www.npmjs.com/search?q=api-testing) [api-manager](https://www.npmjs.com/search?q=api-manager) [postman](https://www.npmjs.com/search?q=postman) [cli](https://www.npmjs.com/search?q=cli)
