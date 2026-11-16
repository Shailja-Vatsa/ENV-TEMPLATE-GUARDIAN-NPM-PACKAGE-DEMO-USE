import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {
  parseEnv,
  validateEnv,
  printHeader,
  printIssuesTable,
  printSummary
} from 'env-template-guardian';

const ENV_FILE = '.env';
const EXAMPLE_FILE = '.env.example';

// 1. Verify existence of required environment files
if (!fs.existsSync(EXAMPLE_FILE)) {
  console.error(`Error: Template file "${EXAMPLE_FILE}" was not found.`);
  process.exit(1);
}

if (!fs.existsSync(ENV_FILE)) {
  console.error(`Error: Environment file "${ENV_FILE}" was not found.`);
  console.error(`Run "npm run env:fix" or copy "${EXAMPLE_FILE}" to "${ENV_FILE}".`);
  process.exit(1);
}

// 2. Parse environment files
const exampleRaw = fs.readFileSync(path.resolve(EXAMPLE_FILE), 'utf-8');
const envRaw = fs.readFileSync(path.resolve(ENV_FILE), 'utf-8');

const exampleMap = parseEnv(exampleRaw);
const actualMap = parseEnv(envRaw);

// 3. Validate actual .env against .env.example
printHeader(ENV_FILE, EXAMPLE_FILE);
const report = validateEnv(exampleMap, actualMap, { strict: true });

// 4. Display validation results
printIssuesTable(report.issues);
printSummary(report, true);

// 5. Exit if validation fails
if (!report.valid) {
  console.error('Server startup aborted: environment configuration is invalid.');
  console.error('Tip: Run "npm run env:fix" or update your .env to fix issues.\n');
  process.exit(1);
}

// Populate process.env with parsed values if not already present
for (const [key, entry] of actualMap.entries()) {
  if (process.env[key] === undefined) {
    process.env[key] = entry.value;
  }
}

// 6. Start lightweight Node.js HTTP server
const PORT = Number(process.env.PORT) || 3000;
const APP_NAME = process.env.APP_NAME || 'ConfigGuardDemo';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      name: APP_NAME,
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    })
  );
});

server.listen(PORT, () => {
  console.log(`Server started successfully: http://localhost:${PORT}`);
  console.log(`Application Name: ${APP_NAME}`);
  console.log(`Ready to receive requests.`);
});
