#!/bin/bash

set -a  # automatically export all variables
source .env
set +a

node ../../iudex/dist/cli/index.js run "tests/*.test.js" "$@" --verbose
