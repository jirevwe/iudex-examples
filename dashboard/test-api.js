#!/usr/bin/env node

/**
 * Test Dashboard API endpoints
 */

const BASE_URL = 'http://localhost:3000/test-dashboard';

async function testAPI() {
  console.log('🧪 Testing Dashboard API\n');

  // Test 1: List Runs
  console.log('Test 1: GET /api/runs');
  try {
    const response = await fetch(`${BASE_URL}/api/runs?limit=2`);
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`   Runs found: ${data.runs.length}`);
    console.log(`   Latest: ${data.latest}`);
    console.log(`   Has more: ${data.hasMore}`);

    if (data.runs.length > 0) {
      const run = data.runs[0];
      console.log(`   First run: ${run.id}`);
      console.log(`   Timestamp: ${run.timestamp}`);
      console.log(`   Tests: ${run.summary.total}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('');

  // Test 2: Get Run Details
  console.log('Test 2: GET /api/run/:id');
  try {
    const runsResponse = await fetch(`${BASE_URL}/api/runs?limit=1`);
    const runsData = await runsResponse.json();

    if (runsData.latest) {
      const response = await fetch(`${BASE_URL}/api/run/${runsData.latest}`);
      const data = await response.json();
      console.log(`✅ Status: ${response.status}`);
      console.log(`   Suites: ${data.suites?.length || 0}`);
      console.log(`   Total tests: ${data.summary.total}`);
      console.log(`   Passed: ${data.summary.passed}`);
      console.log(`   Failed: ${data.summary.failed}`);
      console.log(`   Governance violations: ${data.governance?.violations?.length || 0}`);
      console.log(`   Security findings: ${data.security?.findings?.length || 0}`);
    } else {
      console.log('⚠️  No runs available');
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('');

  // Test 3: Static Assets
  console.log('Test 3: Static Assets');
  try {
    const cssResponse = await fetch(`${BASE_URL}/assets/css/dashboard.css`);
    const jsResponse = await fetch(`${BASE_URL}/assets/js/dashboard.js`);
    console.log(`✅ CSS: ${cssResponse.status}`);
    console.log(`✅ JS: ${jsResponse.status}`);
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('');

  // Test 4: HTML Page
  console.log('Test 4: Dashboard HTML');
  try {
    const response = await fetch(`${BASE_URL}/`);
    const html = await response.text();
    const hasConfig = html.includes('IUDEX_CONFIG');
    const hasScripts = html.includes('type="module"');
    console.log(`✅ Status: ${response.status}`);
    console.log(`   Config injected: ${hasConfig ? 'Yes' : 'No'}`);
    console.log(`   Module scripts: ${hasScripts ? 'Yes' : 'No'}`);

    if (hasConfig) {
      const configMatch = html.match(/IUDEX_CONFIG\s*=\s*({[^}]+})/);
      if (configMatch) {
        console.log(`   Config preview: ${configMatch[1].substring(0, 100)}...`);
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  console.log('\n✨ All tests complete!\n');
}

testAPI().catch(console.error);
