#!/usr/bin/env node

/**
 * Iudex Postgres Dashboard Example
 *
 * Comprehensive showcase of Postgres reporter features:
 * - Test evolution tracking
 * - Deletion detection
 * - Git metadata capture
 * - Analytics endpoints
 * - Docker development environment
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createExpressDashboard } from 'iudex/server/express';
import { DatabaseClient } from 'iudex/database/client';
import { TestRepository } from 'iudex/database/repository';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize database connection for analytics
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'iudex_tests',
  user: process.env.DB_USER || 'iudex',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
};

let dbClient;
let repository;

async function initializeDatabase() {
  try {
    dbClient = new DatabaseClient(dbConfig);
    await dbClient.connect();
    repository = new TestRepository(dbClient);
    console.log('✅ Connected to PostgreSQL');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error.message);
    console.log('⚠️  Dashboard will run without analytics features');
    process.exit(1);
  }
}

await initializeDatabase();

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Iudex Postgres Dashboard Example</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .feature { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .status { padding: 5px 10px; border-radius: 3px; font-size: 14px; }
        .status.connected { background: #d4edda; color: #155724; }
        .status.disconnected { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <h1>🛡️ Iudex Postgres Dashboard Example</h1>

      <p>Database Status: <span class="status ${repository ? 'connected' : 'disconnected'}">
        ${repository ? '✅ Connected' : '❌ Disconnected'}
      </span></p>

      <h2>🎯 Quick Links</h2>
      <div class="feature">
        <strong>📊 Test Dashboard:</strong> <a href="/test-dashboard">/test-dashboard</a>
        <p>View test results with Postgres-powered analytics</p>
      </div>

      ${repository ? `
      <h2>🔧 Analytics API Endpoints (Auto-mounted)</h2>
      <div class="feature">
        <strong>Flaky Tests:</strong> <a href="/test-dashboard/api/analytics/flaky-tests">/test-dashboard/api/analytics/flaky-tests</a>
      </div>
      <div class="feature">
        <strong>Regressions:</strong> <a href="/test-dashboard/api/analytics/regressions">/test-dashboard/api/analytics/regressions</a>
      </div>
      <div class="feature">
        <strong>Health Scores:</strong> <a href="/test-dashboard/api/analytics/health-scores">/test-dashboard/api/analytics/health-scores</a>
      </div>
      <div class="feature">
        <strong>Deleted Tests:</strong> <a href="/test-dashboard/api/analytics/deleted-tests">/test-dashboard/api/analytics/deleted-tests</a>
      </div>
      <div class="feature">
        <strong>Daily Stats:</strong> <a href="/test-dashboard/api/analytics/daily-stats">/test-dashboard/api/analytics/daily-stats</a>
      </div>
      <div class="feature">
        <strong>Database Health:</strong> <a href="/test-dashboard/api/db-health">/test-dashboard/api/db-health</a>
      </div>
      ` : '<p><em>Analytics endpoints require Postgres connection</em></p>'}

      <h2>🚀 Getting Started</h2>
      <ol>
        <li>Run tests: <code>npm test</code></li>
        <li>Visit <a href="/test-dashboard">Test Dashboard</a></li>
        <li>Check analytics endpoints above</li>
        <li>Explore features in README.md</li>
      </ol>
    </body>
    </html>
  `);
});

// Mount dashboard with Postgres analytics
// When repository is provided, the handler automatically mounts all analytics endpoints
app.use('/test-dashboard', createExpressDashboard({
  resultsDir: path.join(__dirname, '.iudex', 'results'),
  title: 'HTTPBin API Tests - Postgres Analytics',
  theme: 'light',
  repository // Analytics endpoints auto-mounted when repository provided
}));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}/test-dashboard`);
  if (repository) {
    console.log(`📈 Analytics: http://localhost:${PORT}/test-dashboard/api/analytics/*`);
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⏹️  Shutting down gracefully...');
  if (dbClient) {
    await dbClient.close();
  }
  process.exit(0);
});
