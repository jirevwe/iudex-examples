#!/usr/bin/env node
/**
 * Dashboard Verification Script
 *
 * Verifies that the GitHub Pages dashboard was generated correctly
 * and all required files are present.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DASHBOARD_DIR = path.join(__dirname, 'docs');
const REQUIRED_FILES = [
  'index.html',
  'config.js',
  'assets/css/dashboard.css',
  'assets/js/dashboard.js',
  'assets/js/data-loader.js',
  'assets/js/components/summary-cards.js',
  'assets/js/components/test-table.js',
  'assets/js/components/governance-panel.js',
  'assets/js/components/security-panel.js',
  'assets/js/components/analytics-overview.js',
  'assets/js/components/flaky-tests-table.js',
  'assets/js/components/regressions-panel.js',
  'assets/js/components/trend-chart.js',
  'assets/js/components/endpoint-rates-table.js',
  'data/runs.json'
];

console.log('🔍 Verifying GitHub Pages Dashboard...\n');

let allGood = true;

// Check if dashboard directory exists
if (!fs.existsSync(DASHBOARD_DIR)) {
  console.error('❌ Dashboard directory not found:', DASHBOARD_DIR);
  console.error('   Run "npm test" to generate the dashboard first.\n');
  process.exit(1);
}

console.log('✅ Dashboard directory exists\n');

// Check all required files
console.log('📂 Checking required files:\n');

for (const file of REQUIRED_FILES) {
  const filePath = path.join(DASHBOARD_DIR, file);

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   ✅ ${file} (${sizeKB} KB)`);
  } else {
    console.log(`   ❌ ${file} - MISSING`);
    allGood = false;
  }
}

// Verify runs.json structure
console.log('\n📊 Verifying runs data:\n');

const runsJsonPath = path.join(DASHBOARD_DIR, 'data/runs.json');
if (fs.existsSync(runsJsonPath)) {
  try {
    const runsData = JSON.parse(fs.readFileSync(runsJsonPath, 'utf-8'));

    if (runsData.runs && Array.isArray(runsData.runs)) {
      console.log(`   ✅ Found ${runsData.runs.length} test run(s)`);

      if (runsData.latest) {
        console.log(`   ✅ Latest run: ${runsData.latest}`);

        // Check if latest run file exists
        const latestRunPath = path.join(DASHBOARD_DIR, 'data', `${runsData.latest}.json`);
        if (fs.existsSync(latestRunPath)) {
          const runData = JSON.parse(fs.readFileSync(latestRunPath, 'utf-8'));
          console.log(`   ✅ Latest run data:`);
          console.log(`      - Total tests: ${runData.summary?.total || 0}`);
          console.log(`      - Passed: ${runData.summary?.passed || 0}`);
          console.log(`      - Failed: ${runData.summary?.failed || 0}`);
          console.log(`      - Duration: ${runData.summary?.duration || 0}ms`);
        } else {
          console.log(`   ⚠️  Latest run file not found`);
        }
      }
    } else {
      console.log('   ⚠️  runs.json has unexpected structure');
    }
  } catch (error) {
    console.log(`   ❌ Failed to parse runs.json: ${error.message}`);
    allGood = false;
  }
}

// Verify config.js
console.log('\n⚙️  Verifying configuration:\n');

const configPath = path.join(DASHBOARD_DIR, 'config.js');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf-8');

  if (configContent.includes('window.DASHBOARD_CONFIG')) {
    console.log('   ✅ Dashboard config object present');
  }

  if (configContent.includes('"mode": "static"')) {
    console.log('   ✅ Static mode configured');
  }
} else {
  console.log('   ❌ config.js not found');
  allGood = false;
}

// Verify index.html
console.log('\n📄 Verifying HTML template:\n');

const indexPath = path.join(DASHBOARD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  if (indexContent.includes('window.IUDEX_CONFIG')) {
    console.log('   ✅ IUDEX_CONFIG injected');
  }

  if (indexContent.includes('<base href')) {
    console.log('   ✅ Base URL configured');
  }

  if (indexContent.includes('data-tab="analytics"')) {
    console.log('   ✅ Analytics tab present');
  }
} else {
  console.log('   ❌ index.html not found');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('✅ SUCCESS! Dashboard is ready for deployment.\n');

  console.log('📝 To preview locally:');
  console.log('   npm run serve-dashboard');
  console.log('   # Then open: http://localhost:8000\n');

  console.log('🚀 To deploy to GitHub Pages:');
  console.log('   1. Commit the docs/ folder:');
  console.log('      git add docs/');
  console.log('      git commit -m "Update test dashboard"');
  console.log('      git push\n');
  console.log('   2. Enable GitHub Pages in repo settings:');
  console.log('      Settings → Pages → Source: main branch /docs folder\n');
  console.log('   Or use the deploy script:');
  console.log('      npm run deploy\n');

  process.exit(0);
} else {
  console.log('❌ FAILED! Some issues were found.\n');
  console.log('   Run "npm test" to regenerate the dashboard.\n');
  process.exit(1);
}
