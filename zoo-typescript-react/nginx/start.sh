#!/bin/sh

# Set a default port if NGINX_PORT is not provided
: "${NGINX_PORT:=80}"

# Debugging: Output the port to check if it's set correctly
echo "Using NGINX_PORT: $NGINX_PORT"

# Replace placeholder with the environment variable or default value
envsubst '$NGINX_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start NGINX
nginx -g 'daemon off;'
