#!/usr/bin/env node

/**
 * Example: Express Server with Iudex Dashboard
 *
 * This example demonstrates how to mount the Iudex dashboard
 * on an Express server alongside your API routes.
 */

import express from 'express';
import { createExpressDashboard } from 'iudex/server/express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Sample API routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/users', (req, res) => {
  res.json({
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]
  });
});

// Mount Iudex Dashboard at /test-dashboard
// Point to iudex's test results directory
const iudexResultsDir = path.join(__dirname, '..', '..', 'iudex', '.iudex', 'results');

app.use('/test-dashboard', createExpressDashboard({
  resultsDir: iudexResultsDir,
  title: 'Iudex API Test Dashboard',
  theme: 'light'
}));

// Root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Iudex Dashboard Example</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #3b82f6; }
        .card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .card h2 { margin-top: 0; }
        a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        a:hover { text-decoration: underline; }
        code {
          background: #e5e7eb;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        ul { padding-left: 20px; }
      </style>
    </head>
    <body>
      <h1>🛡️ Iudex Dashboard Example</h1>

      <div class="card">
        <h2>Available Endpoints</h2>
        <ul>
          <li><a href="/test-dashboard">📊 Test Dashboard</a> - View test results, governance violations, and security findings</li>
          <li><a href="/api/status">🔍 API Status</a> - Check API health</li>
          <li><a href="/api/users">👥 Users API</a> - Sample API endpoint</li>
        </ul>
      </div>

      <div class="card">
        <h2>Dashboard Features</h2>
        <ul>
          <li>✅ Real-time test results with pass/fail status</li>
          <li>⚠️ Governance violations panel</li>
          <li>🔒 Security findings overview</li>
          <li>📈 Historical run comparison</li>
          <li>🔍 Search and filter capabilities</li>
          <li>📱 Mobile-responsive design</li>
        </ul>
      </div>

      <div class="card">
        <h2>Try the Dashboard</h2>
        <p>
          Visit <a href="/test-dashboard">/test-dashboard</a> to see your test results.
        </p>
        <p style="color: #6b7280; font-size: 0.9em;">
          Note: The dashboard displays results from <code>.iudex/results/</code> directory.
          Run your tests first if you don't see any data.
        </p>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Express Server with Iudex Dashboard');
  console.log('─'.repeat(50));
  console.log(`Server running at:     http://localhost:${PORT}`);
  console.log(`Dashboard available at: http://localhost:${PORT}/test-dashboard`);
  console.log('─'.repeat(50));
  console.log('\nPress Ctrl+C to stop\n');
});
