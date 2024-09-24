#!/bin/bash
set -e

# Function to check MySQL connectivity using process substitution for credentials
check_mysql_ready() {
  mysql --defaults-extra-file=<(echo -e "[client]\nuser=$DB_USERNAME\npassword=$DB_PASSWORD\nhost=${DB_HOSTNAME:-localhost}\nport=${DB_PORT:-3306}") $DB_DATABASE --execute="SELECT 1;" >/dev/null 2>&1
}

# Loop until MySQL is ready
until check_mysql_ready; do
  echo "Waiting for MySQL to be ready..."
  sleep 3
done

echo "MySQL is ready."
exec "$@"
