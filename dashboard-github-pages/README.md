# GitHub Pages Dashboard Example

This example demonstrates how to generate a static test dashboard and deploy it to GitHub Pages using Iudex.

## What This Example Demonstrates

1. ✅ Generate a static dashboard from Iudex test results
2. ✅ Deploy to GitHub Pages (or any static host)
3. ✅ Automate dashboard generation with GitHub Actions
4. ✅ Track historical test runs
5. ✅ Display governance violations and security findings
6. ✅ Use the analytics tab (when backed by PostgreSQL)

## Features

- ✅ Static HTML/CSS/JS dashboard (no build tools)
- ✅ Automated generation from test results
- ✅ GitHub Actions workflow for CI/CD
- ✅ Historical run tracking (up to 50 runs)
- ✅ Governance violations display
- ✅ Security findings display
- ✅ Mobile-responsive design
- ✅ Zero-config deployment to GitHub Pages
- ✅ ~100 KB total bundle size (uncompressed, no external dependencies)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests and Generate Dashboard

```bash
npm test
```

This will:
- Run all tests in `tests/` directory
- Generate dashboard files in `docs/` directory
- Create historical run data in `.iudex/results/`

### 3. Verify Dashboard

```bash
npm run verify
```

Checks that all required files were generated correctly.

### 4. Preview Locally

```bash
npm run serve-dashboard
```

Then open http://localhost:8000 in your browser.

## Directory Structure

```
dashboard-github-pages/
├── tests/
│   └── api.test.js              # 16 sample API tests
├── .github/workflows/
│   └── test-and-deploy.yml      # CI/CD automation
├── docs/                         # Generated dashboard (output)
│   ├── index.html               # Main dashboard page (~10 KB)
│   ├── config.js                # Dashboard configuration
│   ├── assets/
│   │   ├── css/
│   │   │   └── dashboard.css    # Styling (~18 KB)
│   │   └── js/
│   │       ├── dashboard.js     # Main app logic
│   │       ├── data-loader.js   # Data loading abstraction
│   │       └── components/      # 9 UI components (~60 KB total)
│   │           ├── summary-cards.js
│   │           ├── test-table.js
│   │           ├── governance-panel.js
│   │           ├── security-panel.js
│   │           ├── analytics-overview.js
│   │           ├── flaky-tests-table.js
│   │           ├── regressions-panel.js
│   │           ├── trend-chart.js
│   │           └── endpoint-rates-table.js
│   └── data/
│       ├── runs.json            # Index of all test runs
│       └── run-*.json           # Individual run data (10-50 KB each)
├── iudex.config.js              # Iudex configuration
├── package.json                 # Dependencies & scripts
├── verify-dashboard.js          # Verification script
└── README.md                     # This file
```

**Total Bundle:** ~100 KB (uncompressed, no external dependencies)

## How It Works

### Test Execution Flow

```
1. npm test
   ↓
2. Iudex runs tests in tests/**/*.test.js
   ↓
3. JSON Reporter → .iudex/results/run-*.json
   ↓
4. GitHub Pages Reporter
   ├── Copies dashboard templates to docs/
   ├── Copies test results to docs/data/
   ├── Builds runs.json index
   └── Injects configuration
   ↓
5. Static dashboard ready in docs/
```

### Dashboard Loading Flow (Browser)

```
1. User opens docs/index.html
   ↓
2. dashboard.js loads
   ↓
3. data-loader.js reads ./data/runs.json
   ↓
4. Loads latest run from ./data/run-*.json
   ↓
5. Components render:
   ├── summary-cards.js → Overview
   ├── test-table.js → Test results
   ├── governance-panel.js → Violations
   ├── security-panel.js → Findings
   └── analytics-* → Not available (static mode)
   ↓
6. User can select historical runs from dropdown
```

## Configuration

### iudex.config.js

Key configuration options:

```javascript
{
  // Test file patterns
  testMatch: ['tests/**/*.test.js'],

  // HTTP client config
  http: {
    baseURL: 'https://httpbin.org',
    timeout: 10000
  },

  // Reporters
  reporters: [
    'console',  // Terminal output
    'json',     // Historical runs (required for tracking)
    {
      reporter: 'github-pages',
      config: {
        outputDir: 'docs',              // GitHub Pages folder
        title: 'Iudex API Tests',       // Dashboard title
        includeHistorical: true,        // Track history
        historicalLimit: 50,            // Max runs to keep
        // Optional: PostgreSQL analytics API endpoint
        // apiEndpoint: process.env.ANALYTICS_API_ENDPOINT
      }
    }
  ],

  // Governance rules (opt-in)
  governance: {
    enabled: true,
    rules: { /* ... */ }
  },

  // Security checks (opt-in)
  security: {
    enabled: true,
    checks: { /* ... */ }
  }
}
```

### GitHub Actions Workflow

The workflow runs on:
- Every push to main/master
- Every pull request
- Manual trigger (workflow_dispatch)

**Environment Variables:**
Add secrets in GitHub repo settings (Settings → Secrets):
```yaml
env:
  API_BASE_URL: ${{ secrets.API_BASE_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

## Dashboard Features

### Included in Static Dashboard

- ✅ **Test Results** - All test results with search and filtering
- ✅ **Governance Panel** - API governance violations
- ✅ **Security Panel** - Security findings with severity levels
- ✅ **Historical Runs** - Compare results across test runs
- ✅ **Git Metadata** - Branch, commit, and message info
- ✅ **Summary Cards** - Total, passed, failed, skipped, duration
- ✅ **Mobile Responsive** - Works on all devices

### Four Dashboard Tabs

**Tests Tab:**
- All test results in searchable table
- Filter by status (all/passed/failed/skipped)
- View error details and stack traces (expandable rows)

**Governance Tab:**
- API governance violations
- Filter by severity (error/warning/info)
- Shows affected endpoints and tests

**Security Tab:**
- Security findings with CWE mappings
- Filter by severity (critical/high/medium/low)
- Detailed descriptions and recommendations

**Analytics Tab:**
- Overview cards with key metrics
- Flaky tests table
- Recent regressions panel
- Daily trends chart
- Endpoint success rates
- *Note: Analytics require PostgreSQL backend (not available in static mode)*

### Not Included (Requires Server)

- ❌ **Analytics** - Flaky tests, regressions, trends (requires PostgreSQL backend)
- ❌ **Real-time Updates** - Live data refresh (static files only)
- ❌ **Database Search** - Advanced filtering (limited to client-side)

To enable analytics, see the [server examples](../dashboard-express/).

## Deployment Options

### Option 1: Automated Deployment with GitHub Actions

The included workflow (`.github/workflows/test-and-deploy.yml`) automatically:
1. Runs tests on every push to main
2. Generates the dashboard
3. Deploys to GitHub Pages

**Setup:**
1. Copy this folder to your repository
2. Push to GitHub
3. Enable GitHub Pages in repo settings:
   - Go to Settings → Pages
   - Source: GitHub Actions (recommended)
   - Or: main branch /docs folder

The dashboard will be available at:
```
https://<username>.github.io/<repo-name>/
```

### Option 2: Manual Deployment

#### Method A: Using docs/ folder

```bash
# 1. Generate dashboard
npm test

# 2. Commit and push
git add docs/
git commit -m "Update test dashboard"
git push

# 3. Enable GitHub Pages
# Settings → Pages → Source: main branch /docs folder
```

#### Method B: Using gh-pages branch

```bash
# 1. Generate dashboard
npm test

# 2. Deploy to gh-pages branch
npm run deploy
```

### Option 3: Deploy to Other Static Hosts

The generated `docs/` folder can be deployed to any static hosting:

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --dir=docs --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod docs/
```

**AWS S3:**
```bash
aws s3 sync docs/ s3://your-bucket-name/ --acl public-read
```

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Sample Test Results

The included `tests/api.test.js` generates:

- **16 API tests** across 3 suites
- **HTTPBin API Tests** (10 tests) - GET, POST, PUT, DELETE, auth, headers
- **Response Validation Tests** (3 tests) - UUID, timing, content-type
- **Edge Cases** (3 tests) - Large responses, redirects, method reflection

These tests demonstrate:
- Various HTTP methods
- Query parameters and headers
- Authentication
- Error handling
- Response validation
- Performance testing

### Verify Dashboard

```bash
# Run verification script
npm run verify
```

The `verify-dashboard.js` script checks:

- ✅ All 14 required files exist
- ✅ runs.json has correct structure
- ✅ Latest run data is valid
- ✅ config.js is properly configured
- ✅ index.html has injected configuration
- ✅ Analytics tab is present

Expected output:
```
✅ SUCCESS! Dashboard is ready for deployment.

📝 To preview locally:
   npm run serve-dashboard

🚀 To deploy to GitHub Pages:
   1. Commit the docs/ folder
   2. Enable GitHub Pages in repo settings
```

## Writing Tests

Tests are written using Iudex's DSL:

```javascript
import { describe, test, expect } from 'iudex';

describe('API Tests', { prefix: 'api' }, () => {
  test('should fetch users', async ({ request }) => {
    const response = await request.get('/users');

    expect(response).toHaveStatus(200);
    expect(response.body).toBeArray();
  }, { id: 'fetch_users' });
});
```

**Best Practices:**
1. Use descriptive test names
2. Provide explicit test IDs for stable slugs
3. Use suite prefixes for organization
4. Add assertions for status, body, headers, and response time
5. Group related tests in describe blocks

## Customization

### Change Dashboard Title

Edit `iudex.config.js`:
```javascript
{
  reporter: 'github-pages',
  config: {
    title: 'Your Custom Title Here'
  }
}
```

### Change Output Directory

For GitHub Pages root deployment:
```javascript
{
  reporter: 'github-pages',
  config: {
    outputDir: '.'  // Deploy to root
  }
}
```

### Add Custom Styles

After generation, modify `docs/assets/css/dashboard.css`:
```css
:root {
  --color-primary: #8b5cf6;  /* Custom primary color */
  --color-success: #10b981;
  --color-error: #ef4444;
}
```

### Adjust Historical Limit

Keep fewer historical runs to reduce bundle size:
```javascript
{
  reporter: 'github-pages',
  config: {
    historicalLimit: 10  // Only keep last 10 runs
  }
}
```

## Troubleshooting

### Dashboard shows blank page

**Cause:** Base URL misconfiguration or CORS issues

**Solution:**
1. Check browser console for errors
2. Ensure serving from a real web server (not `file://`)
3. Verify `<base href>` in `docs/index.html`

```bash
# Use the built-in server
npm run serve-dashboard
```

### GitHub Pages shows 404

**Cause:** Pages not enabled or wrong source

**Solution:**
1. Go to repo Settings → Pages
2. Select source: "main branch /docs folder" or "GitHub Actions"
3. Wait a few minutes for deployment
4. Check Actions tab for deployment logs

### Historical runs not showing

**Cause:** JSON reporter not configured

**Solution:**
Add JSON reporter to `iudex.config.js`:
```javascript
reporters: [
  'console',
  'json',  // Required for historical runs
  'github-pages'
]
```

### Tests failing in CI

**Cause:** Missing environment variables or network issues

**Solution:**
1. Add required secrets in GitHub repo settings
2. Check API base URL is accessible from GitHub Actions
3. Review workflow logs for specific errors

## Advanced Usage

### Multiple Environments

Deploy different dashboards for staging/production:

```javascript
// iudex.config.staging.js
export default {
  http: {
    baseURL: 'https://staging.api.example.com'
  },
  reporters: [
    {
      reporter: 'github-pages',
      config: {
        outputDir: 'docs/staging',
        title: 'Staging API Tests'
      }
    }
  ]
};
```

```bash
# Run with specific config
npx iudex run --config iudex.config.staging.js
```

### Scheduled Tests

Add a schedule to GitHub Actions workflow:

```yaml
on:
  push:
    branches: [main]
  schedule:
    # Run tests every day at 9 AM UTC
    - cron: '0 9 * * *'
```

### Custom Domain

After deploying to GitHub Pages:

1. Add `CNAME` file to `docs/`:
   ```
   tests.yourdomain.com
   ```

2. Configure DNS:
   ```
   CNAME: tests.yourdomain.com → username.github.io
   ```

3. Enable in repo settings:
   Settings → Pages → Custom domain

## Performance

### Local Preview
- Load time: < 1 second
- Dashboard JS: ~60 KB
- No server required

### GitHub Pages
- Deployed via CDN (fast globally)
- HTTPS included (free)
- Unlimited bandwidth

### Build Time
- Test execution: ~6-10 seconds (16 tests)
- Dashboard generation: < 1 second
- Total CI/CD: ~30-60 seconds

## Next Steps

1. **Modify Tests** - Edit `tests/api.test.js` to test your API
2. **Update Config** - Change `baseURL` to your API endpoint in `iudex.config.js`
3. **Run Tests** - `npm test` to generate dashboard
4. **Preview** - `npm run serve-dashboard` to view locally
5. **Deploy** - Push to GitHub or deploy to static host

## Links

- **[Iudex Main Repository](../../iudex)**
- **[Dashboard Guide](../../iudex/docs/DASHBOARD_GUIDE.md)**
- **[GitHub Pages Documentation](https://docs.github.com/en/pages)**
- **[GitHub Actions Documentation](https://docs.github.com/en/actions)**

## Success!

This example successfully demonstrates:

✅ Static dashboard generation from test results
✅ Zero build tools (pure HTML/CSS/JS)
✅ GitHub Pages deployment (automated & manual)
✅ Historical run tracking
✅ Governance & security reporting
✅ CI/CD with GitHub Actions
✅ Verification script
✅ Comprehensive documentation

The generated dashboard is **production-ready** and can be deployed to any static hosting service.

## License

MIT
