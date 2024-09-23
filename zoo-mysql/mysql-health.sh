#!/bin/bash
set -e

# Test MySQL connectivity using process substitution for credentials
mysql --defaults-extra-file=<(echo -e "[client]\nuser=$MYSQL_USER\npassword=$MYSQL_PASSWORD\nhost=${MYSQL_HOSTNAME:-localhost}\nport=${MYSQL_TCP_PORT:-3306}") $MYSQL_DATABASE --execute="SELECT 1;" >/dev/null 2>&1

# If the command succeeds, exit with 0 (healthy)
if [ $? -eq 0 ]; then
  echo "MySQL is healthy."
  exit 0
else
  echo "MySQL is not healthy."
  exit 1
fi