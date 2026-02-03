#!/bin/bash
set -e


echo "🔧 Initializing Iudex database..."

# Load environment or use defaults
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-iudex}"
DB_NAME="${DB_NAME:-iudex_tests}"

# Wait for Postgres
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c '\q' 2>/dev/null; do
  echo "⏳ Waiting for PostgreSQL at $DB_HOST:$DB_PORT..."
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
