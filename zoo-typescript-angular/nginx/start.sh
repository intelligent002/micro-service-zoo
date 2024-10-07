#!/bin/sh

# Set a default values if not provided
: "${NGINX_PORT:=80}"
: "${SERVICE_NAME:=service}"
: "${ENVIRONMENT:=undefined}"
: "${BACKEND_HOSTNAME:=public-api.docker.r7g.org}"

# Debugging: Output to check if it's set correctly
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using SERVICE_NAME: $SERVICE_NAME"
echo "Using ENVIRONMENT: $ENVIRONMENT"
echo "Using BACKEND_HOSTNAME: $BACKEND_HOSTNAME"

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

# Replace placeholder with the environment variable or default value
jq -r ' .apiUrl =       env.BACKEND_HOSTNAME
|       .featureFlagX = false
' /usr/share/nginx/html/assets/config.json > /usr/share/nginx/html/assets/config.json.tmp
mv -f /usr/share/nginx/html/assets/config.json.tmp /usr/share/nginx/html/assets/config.json

# Debugging substitutions
# cat /etc/nginx/conf.d/default.conf
# cat /etc/nginx/nginx.conf
# cat /usr/share/nginx/html/assets/config.json

# Start NGINX
nginx -g 'daemon off;'
