#!/bin/bash
set -e

host="${DB_HOST:-postgres}"
max_attempts=30
attempt=0

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ PostgreSQL connection timeout after $max_attempts attempts"
    exit 1
  fi
  echo "⏳ Waiting for PostgreSQL (attempt $attempt/$max_attempts)..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"
