# Dashboard Examples

This directory contains examples demonstrating different ways to use the Iudex Dashboard.

## Setup

First, install dependencies in this directory:

```bash
cd examples/dashboard
npm install
```

## Examples

### 1. Express Server (`express-server.js`)

Mount the dashboard on an Express server alongside your API routes.

```bash
npm run express
```

Visit: http://localhost:3000/test-dashboard

### 2. Fastify Server (`fastify-server.js`)

Register the dashboard as a Fastify plugin.

```bash
npm run fastify
```

Visit: http://localhost:3001/test-dashboard

### 3. Standalone Server (`standalone-server.js`)

Minimal standalone dashboard server using raw Node.js HTTP.

```bash
npm run standalone
```

Visit: http://localhost:8080

## Requirements

- Node.js >= 18.0.0
- Express, Fastify, or raw HTTP (depending on example)
- Test results in `.iudex/results/` directory

## Features Demonstrated

All examples demonstrate:

✅ Real-time test results display
✅ Governance violations panel
✅ Security findings overview
✅ Historical run comparison
✅ Search and filter capabilities
✅ Mobile-responsive design

## Integration Patterns

### Express

```javascript
import { createExpressDashboard } from 'iudex/server/express';

app.use('/dashboard', createExpressDashboard({
  resultsDir: '.iudex/results',
  title: 'My Dashboard'
}));
```

### Fastify

```javascript
import { createFastifyDashboard } from 'iudex/server/fastify';

await fastify.register(createFastifyDashboard, {
  prefix: '/dashboard',
  resultsDir: '.iudex/results'
});
```

### Standalone

```javascript
import { createStandaloneDashboardServer } from 'iudex/server/http';

const server = createStandaloneDashboardServer({
  resultsDir: '.iudex/results'
});

server.listen(8080);
```

## Next Steps

1. Run tests to generate results: `npm run test:integration`
2. Start one of the example servers
3. Open the dashboard in your browser
4. Explore test results, governance, and security findings

See [DASHBOARD_SERVER.md](../../docs/DASHBOARD_SERVER.md) for complete documentation.
