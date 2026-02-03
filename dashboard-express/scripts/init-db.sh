#!/bin/bash
set -e

printenv | grep -i "DB_"

echo "🔧 Initializing Iudex database..."

# Load environment or use defaults
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-iudex}"
DB_NAME="${DB_NAME:-iudex_tests}"

# Wait for Postgres using nc (netcat) which is available in alpine
echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
max_attempts=30
attempt=0
until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ Failed to connect to PostgreSQL after $max_attempts attempts"
    exit 1
  fi
  sleep 2
done

echo "✅ PostgreSQL is ready"

# Run migrations (if not using autoMigrate)
if [ "${AUTO_MIGRATE}" = "false" ]; then
  echo "🔄 Running database migrations..."
  cd ../../iudex
  npx iudex db:migrate -c ../iudex-examples/dashboard-express/iudex.config.js
  cd ../iudex-examples/dashboard-express
  echo "✅ Migrations completed"
else
  echo "📊 Database '$DB_NAME' ready"
  echo "💡 Migrations will run automatically on first test execution (autoMigrate: true)"
fi

echo "✅ Ready to accept test results!"
