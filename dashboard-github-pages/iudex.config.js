/**
 * Iudex Configuration for GitHub Pages Dashboard Example
 *
 * This configuration generates a static dashboard that can be deployed
 * to GitHub Pages, Netlify, Vercel, or any static hosting service.
 */

export default {
  // Test file patterns
  testMatch: ['tests/**/*.test.js'],

  // HTTP client configuration
  http: {
    baseURL: 'https://httpbin.org',
    timeout: 10000,
    headers: {
      'User-Agent': 'Iudex/1.0 GitHub-Pages-Example'
    }
  },

  // Reporters configuration
  reporters: [
    // Console output for terminal
    'console',

    // JSON reporter - creates .iudex/results/run-*.json files
    // This is required for historical run tracking in the dashboard
    {
      reporter: 'json',
      config: {
        outputDir: '.iudex/results'
      }
    },

    // GitHub Pages reporter - generates static dashboard in docs/
    {
      reporter: 'github-pages',
      config: {
        // Output directory (GitHub Pages typically uses docs/ or root)
        outputDir: 'docs',

        // Dashboard title
        title: 'Iudex API Tests - GitHub Pages Example',

        // Include historical test runs
        includeHistorical: true,

        // Maximum number of historical runs to include
        historicalLimit: 50,

        // Optional: PostgreSQL analytics endpoint (if you have a backend)
        // apiEndpoint: process.env.ANALYTICS_API_ENDPOINT || null
      }
    }
  ],

  // Optional: Governance rules (opt-in)
  governance: {
    enabled: true,
    rules: {
      'rest-standards': { enabled: true, severity: 'warning' },
      'versioning': { enabled: true, severity: 'info' },
      'naming-conventions': { enabled: true, severity: 'info' },
      'http-methods': { enabled: true, severity: 'warning' },
      'pagination': { enabled: true, severity: 'info' }
    }
  },

  // Optional: Security checks (opt-in)
  security: {
    enabled: true,
    checks: {
      'sensitive-data': { enabled: true },
      'authentication': { enabled: true },
      'authorization': { enabled: true },
      'rate-limiting': { enabled: true },
      'ssl-tls': { enabled: true },
      'headers': { enabled: true }
    }
  },

  // Optional: Threshold enforcement
  // Note: Adjust these for your use case - disabled for demo
  thresholds: {
    governanceViolations: {
      error: 100,    // Allow some errors for demo
      warning: 100   // Allow warnings
    },
    securityFindings: {
      critical: 100, // Allow for demo (HTTPBin triggers many)
      high: 100      // Allow for demo
    }
  }
};
