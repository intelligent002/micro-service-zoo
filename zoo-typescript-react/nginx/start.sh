#!/bin/sh

# Set a default port if NGINX_PORT is not provided
: "${NGINX_PORT:=80}"
: "${SERVICE_NAME:=service}"
: "${ENVIRONMENT:=undefined}"

# Debugging: Output the port to check if it's set correctly
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using SERVICE_NAME: $SERVICE_NAME"
echo "Using ENVIRONMENT: $ENVIRONMENT"

# Replace placeholder with the environment variable or default value
envsubst '\
$NGINX_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Replace placeholder with the environment variable or default value
envsubst '\
$NGINX_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Debugging substitutions
# cat /etc/nginx/conf.d/default.conf
# cat /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'
