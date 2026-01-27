#!/usr/bin/env node

/**
 * Example: Fastify Server with Iudex Dashboard
 *
 * This example demonstrates how to register the Iudex dashboard
 * as a Fastify plugin alongside your API routes.
 */

import Fastify from 'fastify';
import { createFastifyDashboard } from 'iudex/server/fastify';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  }
});

const PORT = process.env.PORT || 3001;

// Sample API routes
fastify.get('/api/status', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

fastify.get('/api/users', async (request, reply) => {
  return {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' }
    ]
  };
});

// Root route
fastify.get('/', async (request, reply) => {
  reply.type('text/html');
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Iudex Dashboard Example (Fastify)</title>
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
      <h1>⚡ Iudex Dashboard Example (Fastify)</h1>

      <div class="card">
        <h2>Available Endpoints</h2>
        <ul>
          <li><a href="/test-dashboard">📊 Test Dashboard</a> - View test results</li>
          <li><a href="/api/status">🔍 API Status</a> - Check API health</li>
          <li><a href="/api/users">👥 Users API</a> - Sample API endpoint</li>
        </ul>
      </div>

      <div class="card">
        <h2>Fastify Integration</h2>
        <p>
          This example uses <strong>Fastify</strong> with the Iudex dashboard
          registered as a plugin. The dashboard provides the same features
          as the Express version but with Fastify's high-performance routing.
        </p>
      </div>

      <div class="card">
        <h2>Try the Dashboard</h2>
        <p>
          Visit <a href="/test-dashboard">/test-dashboard</a> to see your test results.
        </p>
      </div>
    </body>
    </html>
  `;
});

// Register Iudex Dashboard
const iudexResultsDir = path.join(__dirname, '..', '..', 'iudex', '.iudex', 'results');

await fastify.register(createFastifyDashboard, {
  prefix: '/test-dashboard',
  resultsDir: iudexResultsDir,
  title: 'Iudex API Test Dashboard (Fastify)',
  theme: 'light'
});

// Start server
try {
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log('\n⚡ Fastify Server with Iudex Dashboard');
  console.log('─'.repeat(50));
  console.log(`Server running at:     http://localhost:${PORT}`);
  console.log(`Dashboard available at: http://localhost:${PORT}/test-dashboard`);
  console.log('─'.repeat(50));
  console.log('\nPress Ctrl+C to stop\n');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
