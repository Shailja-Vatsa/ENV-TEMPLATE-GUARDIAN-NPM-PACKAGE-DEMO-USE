# configguard-demo

A minimal, zero-framework Node.js demonstration application for the published NPM package [`env-template-guardian`](https://www.npmjs.com/package/env-template-guardian).

This demo shows how to validate your `.env` configuration against `.env.example` before bootstrapping a native Node.js HTTP server.

---

## Features Demonstrated

- **Zero-Dependency Native Stack**: Built using only the native Node.js `http`, `fs`, and `path` modules.
- **Fail-Safe Startup**: Prevents the HTTP server from starting when critical environment variables are missing, blank, or formatted incorrectly.
- **Detailed Terminal Diagnostics**: Formats validation errors with clear rule descriptions and severity badges.
- **Interactive Autofix**: Uses `env-template-guardian --fix` to detect and prompt for missing template variables interactively.
- **JSON Status Endpoint**: Returns application name, health status, and uptime when configuration is valid.

---

## Project Structure

```text
├── .env                  # Environment file (intentionally contains test errors)
├── .env.example          # Environment template definitions
├── .gitignore            # Ignores .env and node_modules
├── package.json          # Dependencies and helper scripts
├── server.js             # Validation logic & native HTTP server
└── README.md             # Documentation & usage instructions
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/)

---

## Installation

Clone or open the project folder, then install the dependencies:

```bash
npm install
```

---

## Environment Variables

| Variable | Inferred Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `PORT` | `port` (1-65535) | HTTP port for the web server | `3000` |
| `APP_NAME` | `string` | Display name of the application | `ConfigGuardDemo` |
| `ADMIN_EMAIL` | `email` | Administrator contact address | `admin@example.com` |
| `DEBUG` | `boolean` | Debug mode switch | `true` |
| `API_URL` | `url` | Upstream backend URL | `https://api.example.com` |

---

## Step-by-Step Demo Guide

### 1. Test Server Startup with Invalid Environment

The pre-configured `.env` is intentionally missing `PORT`, has an invalid `ADMIN_EMAIL`, and has an empty `API_URL`.

Try running the server:

```bash
npm start
```

**Expected Result:**
The startup is aborted with exit code `1`, displaying the issues table:
- `PORT`: Missing required key
- `ADMIN_EMAIL`: Type mismatch (expected format `email`)
- `API_URL`: Empty value

---

### 2. Run CLI Validation Checks

You can run the validator CLI directly via npm scripts:

```bash
# Standard validation
npm run env:check

# Strict mode (escalates warnings such as type mismatches to errors)
npm run env:check:strict
```

---

### 3. Use the Interactive Fix Flow (`--fix`)

Run the autofix command to interactively populate missing variables (such as `PORT`):

```bash
npm run env:fix
```

Follow the terminal prompt to accept or specify values.

---

### 4. Provide Valid Configuration and Start the Server

Update `.env` with valid values:

```env
PORT=3000
APP_NAME=ConfigGuardDemo
ADMIN_EMAIL=admin@example.com
DEBUG=true
API_URL=https://api.example.com
```

Now start the server:

```bash
npm start
```

**Expected Result:**
```text
env-guardian v1.0.0
Target: .env | Template: .env.example

  PASS Environment variables validated (5 defined, 5 template entries).

Server started successfully: http://localhost:3000
Application Name: ConfigGuardDemo
Ready to receive requests.
```

---

### 5. Verify the Server Endpoint

In another terminal or browser, test the running server:

```bash
curl http://localhost:3000
```

Response:
```json
{
  "name": "ConfigGuardDemo",
  "status": "healthy",
  "uptime": 0.42,
  "timestamp": "2026-11-16T17:35:00.000Z"
}
```

---

## License

MIT
