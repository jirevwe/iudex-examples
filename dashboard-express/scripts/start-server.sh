#!/bin/bash

printenv | grep -i "DB_"

node server.js "$@"
