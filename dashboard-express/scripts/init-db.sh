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

# Database already created by docker-entrypoint-initdb.d
echo "📊 Database '$DB_NAME' initialized with schema"
echo "✅ Ready to accept test results!"
