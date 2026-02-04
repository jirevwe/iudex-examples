#!/bin/bash

# Only source .env if DB_HOST is not already set (i.e., not running in Docker)
if [ -z "$DB_HOST" ]; then
  set -a  # automatically export all variables
  source .env
  set +a
fi

printenv | grep -i "DB_"

node server.js "$@"
