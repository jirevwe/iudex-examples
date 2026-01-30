#!/bin/bash

# Only load .env if DB_HOST is not already set (e.g., from Docker)
if [ -z "$DB_HOST" ]; then
  set -a  # automatically export all variables
  source .env
  set +a
fi

node server.js "$@"
