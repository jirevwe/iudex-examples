# Iudex Examples

Example applications demonstrating how to use the [Iudex](../iudex) API testing framework.

## Overview

This repository contains working examples of Iudex integration, organized into separate self-contained folders:

### Dashboard Integration Examples

- **express-dashboard** - Express.js server with Iudex dashboard middleware
- **fastify-dashboard** - Fastify server with Iudex dashboard plugin
- **standalone-dashboard** - Minimal Node.js HTTP server (no framework)

### Test Examples

- **httpbin-tests** - HTTPBin API integration tests
- **simple-tests** - Basic test examples
- **failure-tests** - Test failure scenarios
- **governance-security-tests** - Governance rules and security checks

## Prerequisites

- Node.js >= 18.0.0
- [mise](https://mise.jdx.dev/) (recommended for task runner)
- Iudex library (automatically linked from `../iudex`)

## Quick Start

Each example is self-contained with its own dependencies. You can run them individually or use mise tasks.

### Using mise (Recommended)

```bash
# Run dashboard servers
mise run express       # Express on port 3000
mise run fastify       # Fastify on port 3001
mise run standalone    # HTTP on port 8080

# Run tests
mise run test:httpbin
mise run test:simple
mise run test:failures
mise run test:governance
mise run test:all      # Run all tests

# Install all dependencies
mise run install

# Clean all node_modules
mise run clean
```

### Running Individual Examples

Each example can be run independently:

```bash
# Express Dashboard
cd express-dashboard
npm install
npm start              # http://localhost:3000/test-dashboard

# Fastify Dashboard
cd fastify-dashboard
npm install
npm start              # http://localhost:3001/test-dashboard

# Standalone Dashboard
cd standalone-dashboard
npm install
npm start              # http://localhost:8080

# Run specific tests
cd httpbin-tests
npm install
npm test
```

## Project Structure

```
iudex-examples/
├── express-dashboard/          # Express integration
│   ├── package.json
│   └── server.js
├── fastify-dashboard/          # Fastify integration
│   ├── package.json
│   └── server.js
├── standalone-dashboard/       # HTTP server
│   ├── package.json
│   └── server.js
├── httpbin-tests/             # HTTPBin tests
│   ├── package.json
│   └── httpbin.test.js
├── simple-tests/              # Simple examples
│   ├── package.json
│   └── simple.test.js
├── failure-tests/             # Failure cases
│   ├── package.json
│   └── with-failures.test.js
├── governance-security-tests/ # Governance & security
│   ├── package.json
│   └── governance-security-demo.test.js
├── .gitignore
├── .mise.toml                 # Task runner config
├── .claude.md                 # Development context
└── README.md                  # This file
```

**Note:** Each example has its own `package.json` with isolated dependencies.

## Development Workflow

Each example uses Iudex as a local file dependency (`file:../../iudex`):

1. Make changes to Iudex library in `../iudex`
2. Changes are immediately reflected in examples (via symlink)
3. Run examples to verify changes work
4. No manual linking or reinstalling needed

## Dashboard Features

Dashboard examples demonstrate:

- ✅ Real-time test results display
- ✅ Summary cards (total, passed, failed, duration)
- ✅ Filterable test results table
- ✅ Governance violations panel
- ✅ Security findings panel
- ✅ Historical run comparison
- ✅ Search and filter capabilities
- ✅ Mobile-responsive design

## Test Data

Dashboard examples read test results from:
```
../iudex/.iudex/results/
```

Generate test data by running integration tests in the main repo:
```bash
cd ../iudex
npm run test:integration
```

## Adding New Examples

To add a new example:

1. Create a new folder (e.g., `koa-dashboard/`)
2. Add `package.json` with iudex dependency:
   ```json
   {
     "dependencies": {
       "iudex": "file:../../iudex",
       "koa": "^2.14.0"
     }
   }
   ```
3. Create your example code
4. Add a task to `.mise.toml`
5. Update this `README.md`

## Documentation

- [Iudex Dashboard Server Guide](../iudex/docs/DASHBOARD_SERVER.md)
- [Iudex API Documentation](../iudex/docs/DASHBOARD_API.md)
- [Main Iudex README](../iudex/README.md)

## License

MIT
