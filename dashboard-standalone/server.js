#!/usr/bin/env node

/**
 * Example: Standalone HTTP Server with Iudex Dashboard
 *
 * This example demonstrates a minimal standalone dashboard server
 * using raw Node.js HTTP (no Express required).
 */

import { createStandaloneDashboardServer } from 'iudex/server/http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;

// Create standalone dashboard server
const iudexResultsDir = path.join(__dirname, '.iudex', 'results');

const server = createStandaloneDashboardServer({
  resultsDir: iudexResultsDir,
  title: 'Iudex Test Dashboard (Standalone)',
  theme: 'light'
});

// Start server
server.listen(PORT, () => {
  console.log('\n🌐 Standalone Dashboard Server');
  console.log('─'.repeat(50));
  console.log(`Dashboard running at: http://localhost:${PORT}`);
  console.log('─'.repeat(50));
  console.log('\nFeatures:');
  console.log('  • No framework dependencies');
  console.log('  • Minimal resource usage');
  console.log('  • Direct file-based serving');
  console.log('\nPress Ctrl+C to stop\n');
});
