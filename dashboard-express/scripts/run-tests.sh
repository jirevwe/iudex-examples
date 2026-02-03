#!/bin/bash

set -a  # automatically export all variables
source .env
set +a

node ../../iudex/cli/index.js run tests/*.test.js "$@" --verbose
