# Iudex Postgres Dashboard Example

> 📊 **Comprehensive showcase** of Iudex's Postgres reporter with analytics, test evolution tracking, and team collaboration.

## 🎯 What This Example Demonstrates

This example showcases **ALL** Postgres reporter features:

1. **Test Evolution Tracking** - Rename tests, maintain history via test slugs
2. **Deletion Detection** - Automatically mark deleted tests
3. **Git Metadata** - Capture branch, commit, author information
4. **Analytics Features** - Flaky tests, regressions, health scores, daily trends
5. **Dual-Mode Operation** - Single-transaction (small) vs batched (large reports)
6. **Docker Development** - One-command local setup
7. **CI/CD Integration** - GitHub Actions with remote Postgres
8. **Team Collaboration** - Shared database for multiple developers

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Git

### Setup (3 commands)

```bash
# 1. Start Postgres (uses port 5433 to avoid conflicts)
docker compose up -d postgres

# 2. Run tests (automatically loads .env and persists to database)
npm test

# 3. Open dashboard
open http://localhost:3000/test-dashboard
```

**Note:** The example uses port **5433** for Postgres to avoid conflicts with local PostgreSQL installations on port 5432.

### Start the Dashboard Server

```bash
# Start the server (automatically loads .env)
npm start

# Server will be available at http://localhost:3000
```

### Alternative: Full Docker Setup

```bash
# Start both Postgres and Dashboard in Docker
docker compose up -d

# Wait for services to start (first time installs dependencies)
# Dashboard will be available at http://localhost:3000
```

## 📚 Table of Contents

- [Architecture](#architecture)
- [Features In Depth](#features-in-depth)
- [Local Development](#local-development)
- [CI/CD Setup](#cicd-setup)
- [API Endpoints](#api-endpoints)
- [Validation Steps](#validation-steps)
- [Troubleshooting](#troubleshooting)

## 🏗️ Architecture

```
┌─────────────────┐
│  Developer      │
│  Runs Tests     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────────┐
│ Postgres        │─────▶│  PostgreSQL      │
│ Reporter        │      │  Database        │
└─────────────────┘      └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Express         │
                         │  Dashboard       │
                         │  + Analytics API │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │  Chrome Browser  │
                         └──────────────────┘
```

## ✨ Features In Depth

### 1. Test Evolution Tracking

**What it does:** Maintains test identity across renames using stable slugs.

**Try it:**
```bash
# 1. Run tests
npm test

# 2. Rename a test in tests/httpbin.test.js
# Change: 'should retrieve GET endpoint with parameters'
# To: 'should fetch GET endpoint successfully'

# 3. Run tests again
npm test

# 4. Check test history in database
docker-compose exec postgres psql -U iudex -d iudex_tests -c \
  "SELECT name, test_slug, total_runs FROM tests WHERE test_slug = 'httpbin.api.get_with_params';"
```

The test_slug (`httpbin.api.get_with_params`) stays the same, but name changes are tracked in `test_history` table.

### 2. Deletion Detection

**What it does:** Automatically marks tests as deleted when they're removed from suite.

**Try it:**
```bash
# 1. Run tests
npm test

# 2. Comment out the test with id 'deprecated_basic_auth' in tests/httpbin.test.js

# 3. Run tests again
npm test

# 4. Check deleted tests
curl http://localhost:3000/test-dashboard/api/analytics/deleted-tests | jq
```

You'll see the deleted test with `deleted_at` timestamp and lifecycle information.

**Resurrection:** Uncomment the test and run again - it's automatically restored!

### 3. Git Metadata Capture

**What it does:** Automatically captures git branch, commit SHA, and commit message.

**Verify:**
```bash
# Check latest run
curl http://localhost:3000/test-dashboard/api/runs | jq '.runs[0].gitInfo'
```

Shows:
```json
{
  "branch": "main",
  "commit": "a1b2c3d4...",
  "message": "Add comprehensive Postgres example"
}
```

### 4. Analytics Features

#### Flaky Tests
Tests that pass sometimes, fail sometimes (10-90% failure rate).

```bash
curl http://localhost:3000/test-dashboard/api/analytics/flaky-tests | jq
```

#### Recent Regressions
Tests that were passing but now failing (7-day window).

```bash
curl http://localhost:3000/test-dashboard/api/analytics/regressions | jq
```

#### Health Scores
Multi-dimensional test health metrics (success rate, stability, performance).

```bash
curl http://localhost:3000/test-dashboard/api/analytics/health-scores | jq
```

#### Daily Stats
Aggregated daily statistics for trend analysis.

```bash
curl http://localhost:3000/test-dashboard/api/analytics/daily-stats?days=7 | jq
```

### 5. Dual-Mode Operation

**Small reports (<100 tests):** Single transaction (atomic, fast)
**Large reports (100+ tests):** Batched (100 per batch, scalable)

Mode is automatically selected based on test count.

**Verify batching:**
```bash
# Check console output when running tests
npm test

# Look for: "Using batched mode for X tests (Y batches)"
```

## 💻 Local Development

### Environment Variables

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

Default values work out of the box for Docker Compose.

### Development Workflow

```bash
# Start services
docker-compose up -d

# Watch logs
docker-compose logs -f dashboard

# Run tests
npm test

# View dashboard
open http://localhost:3000

# Stop services
docker-compose down

# Reset database (clean slate)
docker-compose down -v
docker-compose up -d
```

### Development Commands

```bash
npm run dev           # Start server with hot reload
npm test              # Run tests with Postgres reporting
npm test:verbose      # Run tests with verbose output
npm run docker:up     # Start Docker services
npm run docker:down   # Stop Docker services
npm run docker:logs   # View dashboard logs
npm run docker:reset  # Reset everything (fresh start)
npm run db:health     # Check database connection
```

## 🔄 CI/CD Setup

### GitHub Actions Integration

This example includes a complete GitHub Actions workflow that demonstrates:
- Remote Postgres connection
- Scheduled runs for trend data
- PR comments with test results
- Artifact uploads as fallback

### Setting Up Remote Postgres

**Option 1: DigitalOcean Managed Database**

1. Create Managed Database (PostgreSQL 15+)
2. Note connection details
3. Initialize schema:
   ```bash
   psql "postgresql://user:pass@host:port/db?sslmode=require" < ../../iudex/database/schema.sql
   ```

**Option 2: AWS RDS**

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Initialize schema (same as above)

### Configure GitHub Secrets

Add these secrets to your repository:

- `POSTGRES_HOST` - Database hostname
- `POSTGRES_PORT` - Database port (usually 5432)
- `POSTGRES_DATABASE` - Database name
- `POSTGRES_USER` - Database user
- `POSTGRES_PASSWORD` - Database password

### Workflow Triggers

- **Push to main:** Run tests on every commit
- **Pull requests:** Run tests and comment results
- **Schedule:** Run every 6 hours for trend data

## 🔌 API Endpoints

### Dashboard

| Endpoint | Description |
|----------|-------------|
| `/` | Home page with links |
| `/test-dashboard` | Main dashboard UI |

### Test Results

| Endpoint | Description |
|----------|-------------|
| `/test-dashboard/api/runs` | List test runs (paginated) |
| `/test-dashboard/api/run/:runId` | Get specific run details |

### Analytics (Auto-mounted when repository provided)

| Endpoint | Query Params | Description |
|----------|--------------|-------------|
| `/test-dashboard/api/analytics/flaky-tests` | `?minRuns=5` | Tests with 10-90% failure rate |
| `/test-dashboard/api/analytics/regressions` | - | Tests that were passing, now failing |
| `/test-dashboard/api/analytics/health-scores` | `?limit=20` | Test health metrics |
| `/test-dashboard/api/analytics/deleted-tests` | `?limit=10` | Recently deleted tests |
| `/test-dashboard/api/analytics/daily-stats` | `?days=30` | Daily aggregated statistics |
| `/test-dashboard/api/db-health` | - | Database connection health |

**Note:** Analytics endpoints are automatically mounted by the library when `repository` is provided to `createExpressDashboard()`. No manual endpoint implementation needed.

### Example API Usage

```bash
# Get flaky tests (minimum 5 runs)
curl http://localhost:3000/test-dashboard/api/analytics/flaky-tests?minRuns=5 | jq

# Get health scores (top 20)
curl http://localhost:3000/test-dashboard/api/analytics/health-scores?limit=20 | jq

# Get daily stats (last 7 days)
curl http://localhost:3000/test-dashboard/api/analytics/daily-stats?days=7 | jq

# Check database health
curl http://localhost:3000/test-dashboard/api/db-health | jq
```

## ✅ Validation Steps (Chrome)

Follow these steps to validate all features work correctly.

### Step 1: Basic Setup

```bash
# Terminal 1: Start services
docker-compose up -d

# Terminal 2: Run tests
npm test
```

**Chrome:**
1. Open http://localhost:3000
2. ✅ Verify home page loads
3. ✅ Verify "Database Status: Connected" shows green
4. Click "Test Dashboard" link
5. ✅ Verify dashboard loads with test results

### Step 2: Test Results Display

**Chrome Dashboard:**
1. ✅ Verify list of test runs appears
2. Click on latest run
3. ✅ Verify test details display (pass/fail, duration)
4. ✅ Verify git metadata shows (branch, commit)

### Step 3: Analytics Endpoints

**Chrome:**
1. Open http://localhost:3000/test-dashboard/api/analytics/flaky-tests
2. ✅ Verify JSON response (may be empty initially)
3. Open /test-dashboard/api/analytics/health-scores
4. ✅ Verify health metrics displayed
5. Open /test-dashboard/api/db-health
6. ✅ Verify database connection status shows healthy

**DevTools:**
1. Open Chrome DevTools (F12)
2. Network tab
3. ✅ Verify no errors
4. ✅ Verify API responses are 200 OK

### Step 4: Test Evolution

**Terminal:**
```bash
# 1. Note current test count
npm test | grep "Total:"

# 2. Edit tests/httpbin.test.js
# Rename: 'should retrieve GET endpoint with parameters'
# To: 'should fetch GET endpoint successfully'

# 3. Run tests again
npm test
```

**Chrome:**
1. Refresh dashboard
2. ✅ Verify test count unchanged
3. ✅ Verify renamed test appears with new name
4. ✅ Verify test slug remained same

### Step 5: Deletion Detection

**Terminal:**
```bash
# 1. Run tests
npm test

# 2. Comment out the test with id 'deprecated_basic_auth' in tests/httpbin.test.js

# 3. Run tests again
npm test
```

**Chrome:**
1. Open http://localhost:3000/test-dashboard/api/analytics/deleted-tests
2. ✅ Verify deleted test appears in JSON
3. ✅ Verify `deleted_at` timestamp present
4. ✅ Verify lifecycle information shown

**Resurrection Test:**
```bash
# Uncomment the test
npm test
```

**Chrome:**
1. Refresh /test-dashboard/api/analytics/deleted-tests
2. ✅ Verify test no longer in deleted list

### Step 6: Multiple Runs (Trend Data)

**Terminal:**
```bash
# Run tests 5 times
for i in {1..5}; do npm test; sleep 2; done
```

**Chrome:**
1. Refresh http://localhost:3000/test-dashboard
2. ✅ Verify multiple runs listed
3. ✅ Verify chronological order
4. Click different runs
5. ✅ Verify each run loads correctly

## 🐛 Troubleshooting

### Docker Build Fails with "Missing target in lock file"

**Symptom:** `npm error Missing target in lock file: "../iudex"`

**Cause:** Docker build context can't access the parent `iudex` directory

**Solution 1 (Recommended):** Run dashboard locally, only Postgres in Docker
```bash
# Start only Postgres
docker compose up -d postgres

# Run dashboard locally
npm install
DB_PASSWORD=iudex_dev_password npm start
```

**Solution 2:** Use full Docker setup (takes longer first time)
```bash
# Updated docker-compose.yml now mounts parent directory
docker compose up -d

# First startup installs dependencies in container (takes 1-2 minutes)
```

### Database Connection Failed

**Symptom:** "Failed to connect to PostgreSQL"

**Solutions:**
```bash
# Check if Postgres container is running
docker compose ps

# If not running, start it
docker-compose up -d postgres

# Check logs
docker-compose logs postgres

# Verify network
docker network inspect dashboard-express_iudex-network
```

### Schema Not Initialized

**Symptom:** "relation 'test_runs' does not exist"

**Solution:**
```bash
# Reset database and reinitialize
docker-compose down -v
docker-compose up -d
```

The schema is automatically loaded from `../../iudex/database/schema.sql` on first start.

### Port 3000 Already in Use

**Solution:**
```bash
# Change port in .env
echo "DASHBOARD_PORT=3001" >> .env

# Restart
docker-compose restart dashboard
```

### Analytics Show Empty

**Reason:** Need multiple test runs for analytics data.

**Solution:**
```bash
# Run tests multiple times
for i in {1..10}; do npm test; sleep 2; done

# Now check analytics
curl http://localhost:3000/test-dashboard/api/analytics/health-scores | jq
```

### Tests Not Persisting to Database

**Check:**
1. ✅ `POSTGRES_ENABLED=true` in `.env`
2. ✅ Database credentials correct
3. ✅ Postgres container running

```bash
# Verify reporter config
cat iudex.config.js

# Test database connection
npm run db:health
```

## 📊 Database Schema

The Postgres reporter uses 5 core tables:

- **test_suites** - Test collections/modules
- **test_runs** - Individual test executions
- **tests** - Unique test definitions (by slug)
- **test_history** - Audit trail of test changes
- **test_results** - Immutable log of individual results

Schema location: `../../iudex/database/schema.sql`

## 🤝 Team Collaboration Workflow

### Scenario: Team Using Shared Remote Postgres

**Setup:**
1. Create remote Postgres (DigitalOcean, AWS RDS)
2. Initialize schema
3. Share connection details with team

**Developer 1 (Local):**
```bash
# Configure .env to use remote Postgres
DB_HOST=your-remote-host.db.ondigitalocean.com
DB_PORT=25060
DB_SSL=true
DB_USER=iudex
DB_PASSWORD=secure-password
DB_NAME=iudex_production

# Run tests
npm test
```

**Developer 2 (Local):**
```bash
# Same .env configuration
# Run tests
npm test
```

**CI/CD (GitHub Actions):**
- Configured with same remote Postgres
- Runs on every commit
- Scheduled runs for trend data

**Team Dashboard Access:**
- Deploy Express server pointing to remote Postgres
- Team accesses https://dashboard.example.com
- Everyone sees all test runs from:
  - Local developer runs
  - CI/CD runs
  - Scheduled runs

**Benefits:**
- Centralized test history
- Trend analysis across team
- Flaky test detection across all runs
- Shared analytics dashboard

## 📝 License

Same as main Iudex project.
