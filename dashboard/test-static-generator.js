#!/usr/bin/env node

/**
 * Test GitHub Pages Reporter (Static Dashboard Generator)
 */

import { GitHubPagesReporter } from './reporters/github-pages.js';
import fs from 'fs';
import path from 'path';

console.log('📊 Testing Static Dashboard Generator\n');

// Create a mock collector with test results
class MockCollector {
  toJSON() {
    // Read actual test results
    const latestPath = path.join('.iudex', 'results', 'latest.json');
    if (fs.existsSync(latestPath)) {
      return JSON.parse(fs.readFileSync(latestPath, 'utf-8'));
    }

    // Fallback mock data
    return {
      suites: [
        {
          name: 'Sample Tests',
          tests: [
            {
              name: 'Test 1',
              status: 'passed',
              duration: 100
            }
          ]
        }
      ],
      summary: {
        total: 1,
        passed: 1,
        failed: 0,
        skipped: 0,
        duration: 100
      },
      governance: {
        violations: [],
        warnings: []
      },
      security: {
        findings: []
      },
      metadata: {
        startTime: new Date().toISOString(),
        gitInfo: {
          branch: 'main',
          commitSha: 'abc123',
          commitMessage: 'Test commit'
        }
      }
    };
  }
}

async function testGenerator() {
  try {
    console.log('✅ Creating GitHub Pages Reporter...');

    const reporter = new GitHubPagesReporter({
      outputDir: '.iudex/static-dashboard',
      title: 'Iudex Test Dashboard (Static)',
      includeHistorical: true,
      historicalLimit: 10
    });

    console.log('✅ Generating static dashboard...\n');

    const collector = new MockCollector();
    await reporter.report(collector);

    console.log('\n📂 Checking generated files...\n');

    const outputDir = '.iudex/static-dashboard';
    const requiredFiles = [
      'index.html',
      'assets/css/dashboard.css',
      'assets/js/dashboard.js',
      'assets/js/data-loader.js',
      'assets/js/components/summary-cards.js',
      'assets/js/components/test-table.js',
      'assets/js/components/governance-panel.js',
      'assets/js/components/security-panel.js',
      'data/runs.json',
      'config.js'
    ];

    let allFilesExist = true;
    for (const file of requiredFiles) {
      const filePath = path.join(outputDir, file);
      const exists = fs.existsSync(filePath);
      const icon = exists ? '✅' : '❌';
      const size = exists ? `(${fs.statSync(filePath).size} bytes)` : '';
      console.log(`${icon} ${file} ${size}`);
      if (!exists) allFilesExist = false;
    }

    if (!allFilesExist) {
      console.log('\n❌ Some files are missing!');
      process.exit(1);
    }

    // Check index.html for base href
    console.log('\n🔍 Validating index.html...');
    const indexHtml = fs.readFileSync(path.join(outputDir, 'index.html'), 'utf-8');
    const hasBaseHref = indexHtml.includes('<base href');
    const hasStaticMode = indexHtml.includes('"mode": "static"');

    console.log(`   Base href: ${hasBaseHref ? '✅' : '❌'}`);
    console.log(`   Static mode: ${hasStaticMode ? '✅' : '❌'}`);

    // Check runs.json
    console.log('\n🔍 Validating runs.json...');
    const runsJson = JSON.parse(fs.readFileSync(path.join(outputDir, 'data', 'runs.json'), 'utf-8'));
    console.log(`   Runs count: ${runsJson.runs?.length || 0}`);
    console.log(`   Latest run: ${runsJson.latest || 'N/A'}`);

    // Check config.js
    console.log('\n🔍 Validating config.js...');
    const configJs = fs.readFileSync(path.join(outputDir, 'config.js'), 'utf-8');
    console.log(`   Contains config: ${configJs.includes('DASHBOARD_CONFIG') ? '✅' : '❌'}`);

    console.log('\n✨ Static dashboard generation successful!\n');
    console.log('📍 Output directory: .iudex/static-dashboard');
    console.log('\n🌐 To test locally:');
    console.log('   cd .iudex/static-dashboard');
    console.log('   python3 -m http.server 8000');
    console.log('   Open: http://localhost:8000\n');

  } catch (error) {
    console.error('\n❌ Generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testGenerator();
