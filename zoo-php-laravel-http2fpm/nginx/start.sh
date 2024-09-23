#!/bin/sh

# Set a default ports if env vars are not provided
: "${NGINX_PORT:=8004}"
: "${ZOO_PHP_LARAVEL_PORT:=8003}"


# Logging configuration of the ports
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using ZOO_PHP_LARAVEL_PORT: $ZOO_PHP_LARAVEL_PORT"

# Replace placeholder with the environment variable or default value
envsubst '$ZOO_PHP_LARAVEL_PORT $NGINX_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Debugging substitution
cat /etc/nginx/conf.d/default.conf

# Start NGINX
nginx -g 'daemon off;'
