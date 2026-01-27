#!/usr/bin/env node

/**
 * Test static dashboard in browser
 */

import { chromium } from 'playwright';

async function testStaticDashboard() {
  console.log('🌐 Testing Static Dashboard in Chrome...\n');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  // Capture network errors
  page.on('requestfailed', request => {
    console.log(`❌ Network Failed: ${request.url()}`);
  });

  try {
    console.log('📄 Loading: http://localhost:8000\n');

    const response = await page.goto('http://localhost:8000', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log(`✅ Page Status: ${response.status()}\n`);

    await page.waitForTimeout(2000);

    const title = await page.title();
    console.log(`📌 Page Title: ${title}`);

    // Check dashboard state
    const loadingVisible = await page.locator('#loading-state').isVisible();
    const errorVisible = await page.locator('#error-state').isVisible();
    const contentVisible = await page.locator('#dashboard-content').isVisible();

    console.log(`\n📊 Dashboard State:`);
    console.log(`   Loading: ${loadingVisible}`);
    console.log(`   Error: ${errorVisible}`);
    console.log(`   Content: ${contentVisible}`);

    if (errorVisible) {
      const errorMsg = await page.locator('#error-message').textContent();
      console.log(`\n❌ Error Message: ${errorMsg}`);
    }

    if (contentVisible) {
      const total = await page.locator('#summary-total').textContent();
      const passed = await page.locator('#summary-passed').textContent();
      const failed = await page.locator('#summary-failed').textContent();
      const testRows = await page.locator('.test-table tbody tr').count();

      console.log(`\n✅ Summary Cards:`);
      console.log(`   Total: ${total}`);
      console.log(`   Passed: ${passed}`);
      console.log(`   Failed: ${failed}`);

      console.log(`\n📋 Test Table:`);
      console.log(`   Rows: ${testRows}`);

      // Check if runs.json was loaded
      const runSelector = await page.locator('#run-selector option').count();
      console.log(`\n📁 Run Selector:`);
      console.log(`   Options: ${runSelector}`);
    }

    // Check config
    const config = await page.evaluate(() => window.IUDEX_CONFIG);
    console.log(`\n⚙️  Config:`);
    console.log(`   Mode: ${config.mode}`);
    console.log(`   Base URL: ${config.baseUrl}`);

    // Screenshot
    await page.screenshot({ path: '/tmp/static-dashboard.png', fullPage: true });
    console.log(`\n📸 Screenshot: /tmp/static-dashboard.png`);

    console.log(`\n✨ Static dashboard test complete!\n`);

  } catch (error) {
    console.error(`\n❌ Test Failed: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testStaticDashboard().catch(console.error);
