#!/usr/bin/env node

/**
 * Browser-like test for dashboard
 */

import { chromium } from 'playwright';

async function testDashboard() {
  console.log('🌐 Launching Chrome to test dashboard...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ Console Error: ${text}`);
    } else if (type === 'warn') {
      console.log(`⚠️  Console Warning: ${text}`);
    } else if (text.includes('Error') || text.includes('Failed')) {
      console.log(`🔍 Console: ${text}`);
    }
  });

  // Capture network errors
  page.on('requestfailed', request => {
    console.log(`❌ Network Failed: ${request.url()}`);
    console.log(`   Error: ${request.failure().errorText}`);
  });

  try {
    console.log('📄 Loading: http://localhost:3000/test-dashboard\n');

    // Navigate to dashboard
    const response = await page.goto('http://localhost:3000/test-dashboard', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    console.log(`✅ Page Status: ${response.status()}\n`);

    // Wait a bit for JavaScript to execute
    await page.waitForTimeout(2000);

    // Check what's visible
    const title = await page.title();
    console.log(`📌 Page Title: ${title}`);

    // Check if loading state is still showing
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
      // Check summary cards
      const total = await page.locator('#summary-total').textContent();
      const passed = await page.locator('#summary-passed').textContent();
      const failed = await page.locator('#summary-failed').textContent();

      console.log(`\n✅ Summary Cards:`);
      console.log(`   Total: ${total}`);
      console.log(`   Passed: ${passed}`);
      console.log(`   Failed: ${failed}`);

      // Check test table
      const testRows = await page.locator('.test-table tbody tr').count();
      console.log(`\n📋 Test Table:`);
      console.log(`   Rows: ${testRows}`);
    }

    // Get browser console logs
    console.log(`\n🔍 Checking JavaScript execution...`);
    const logs = await page.evaluate(() => {
      return {
        config: typeof window.IUDEX_CONFIG !== 'undefined' ? window.IUDEX_CONFIG : null,
        errors: window.__errors || []
      };
    });

    console.log(`\n⚙️  Config:`, logs.config);

    // Take screenshot
    await page.screenshot({ path: '/tmp/dashboard-screenshot.png', fullPage: true });
    console.log(`\n📸 Screenshot saved to: /tmp/dashboard-screenshot.png`);

  } catch (error) {
    console.error(`\n❌ Test Failed: ${error.message}`);
    console.error(error.stack);
  } finally {
    await browser.close();
  }
}

testDashboard().catch(console.error);
