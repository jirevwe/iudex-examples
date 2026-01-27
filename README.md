# Iudex Examples

Example applications demonstrating how to use the [Iudex](../iudex) API testing framework.

## Overview

This repository contains working examples of Iudex dashboard integration with various server frameworks:

- **Express** - Traditional Express.js server with middleware
- **Fastify** - High-performance Fastify server with plugin
- **Standalone** - Minimal Node.js HTTP server (no framework)

## Prerequisites

- Node.js >= 18.0.0
- [mise](https://mise.jdx.dev/) (optional, for task runner)
- Iudex library (automatically linked from `../iudex`)

## Setup

```bash
# Install dependencies
npm install

# Or use mise
mise install
```

## Running Examples

### Express Server

```bash
npm run express
# or: mise run express

# Visit: http://localhost:3000/test-dashboard
```

### Fastify Server

```bash
npm run fastify
# or: mise run fastify

# Visit: http://localhost:3001/test-dashboard
```

### Standalone HTTP Server

```bash
npm run standalone
# or: mise run standalone

# Visit: http://localhost:8080/
```

## Testing

```bash
# Test API endpoints
npm run test:api

# Test dashboard in headless browser
npm run test:browser
```

## Project Structure

```
iudex-examples/
├── dashboard/
│   ├── express-server.js       # Express example
│   ├── fastify-server.js       # Fastify example
│   ├── standalone-server.js    # HTTP example
│   ├── test-api.js            # API tests
│   └── test-browser.js        # Browser tests
├── package.json
├── .mise.toml                 # Task runner config
└── README.md
```

## Development Workflow

This repo uses Iudex as a local file dependency (`file:../iudex`). When developing:

1. Make changes to Iudex library
2. Changes are immediately reflected in examples
3. Test examples to verify changes work

## Dashboard Features

All examples demonstrate:

- ✅ Real-time test results display
- ✅ Summary cards (total, passed, failed, duration)
- ✅ Filterable test results table
- ✅ Governance violations panel
- ✅ Security findings panel
- ✅ Historical run comparison
- ✅ Search and filter capabilities
- ✅ Mobile-responsive design

## Documentation

See the [Iudex Dashboard Documentation](../iudex/docs/DASHBOARD_SERVER.md) for detailed integration guides.

## License

MIT