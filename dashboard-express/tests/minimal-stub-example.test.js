import { describe, test, expect } from 'iudex';

/**
 * Minimal Test Stubs Example - Quick Reference
 *
 * This is the simplest possible example of using test stubs.
 * Perfect for getting started!
 */

describe('Quick Start Example', { prefix: 'quick' }, () => {
  const baseUrl = 'https://seal-app-7wdhb.ondigitalocean.app';

  // ✅ A normal, implemented test
  test('should get data successfully', async (context) => {
    const response = await context.request.get(`${baseUrl}/get`);
    expect(response.status).toBe(200);
  }, { id: 'get_data' });

  // 🔲 A test stub - just the name, no implementation
  test.stub('should post data', { id: 'post_data' });

  // 🔲 Another stub
  test.stub('should update data', { id: 'update_data' });

  // 🔲 And another
  test.stub('should delete data', { id: 'delete_data' });
});

/**
 * That's it! When you run this:
 *
 * Console output:
 * ================
 *   ✓ should get data successfully (150ms)
 *   ◻ should post data (unimplemented)
 *   ◻ should update data (unimplemented)
 *   ◻ should delete data (unimplemented)
 *
 *   Total: 4 | Passed: 1 | Unimplemented: 3
 *
 * Dashboard shows:
 * ================
 *   - Summary: 1 passed, 3 unimplemented
 *   - Filter to "Unimplemented Only" to see your TODO list
 *   - Gray squares (◻) mark stubbed tests
 *
 * Next steps:
 * ===========
 * 1. Run: npm test -- tests/minimal-stub-example.test.js
 * 2. Open dashboard: http://localhost:3000/test-dashboard
 * 3. Select "Unimplemented Only" from filter dropdown
 * 4. See your test backlog!
 *
 * To implement a stub:
 * ====================
 * Replace:
 *   test.stub('should post data', { id: 'post_data' });
 *
 * With:
 *   test('should post data', async (context) => {
 *     // Add your test code here
 *   }, { id: 'post_data' });
 */
