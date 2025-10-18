#!/bin/sh

# Set a default ports if env vars are not provided
: "${NGINX_PORT:=8004}"
: "${ZOO_PHP_LARAVEL_PORT:=8003}"
: "${SERVICE_NAME:=service}"
: "${ENVIRONMENT:=undefined}"


# Logging configuration of the ports
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using ZOO_PHP_LARAVEL_HOST: $ZOO_PHP_LARAVEL_HOST"
echo "Using ZOO_PHP_LARAVEL_PORT: $ZOO_PHP_LARAVEL_PORT"
echo "Using SERVICE_NAME: $SERVICE_NAME"
echo "Using ENVIRONMENT: $ENVIRONMENT"

# Replace placeholder with the environment variable or default value
envsubst '\
$ZOO_PHP_LARAVEL_HOST \
$ZOO_PHP_LARAVEL_PORT \
$NGINX_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Replace placeholder with the environment variable or default value
envsubst '\
$ZOO_PHP_LARAVEL_HOST \
$ZOO_PHP_LARAVEL_PORT \
$NGINX_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Debugging substitutions
echo "---=[/etc/nginx/conf.d/default.conf]=---"
cat /etc/nginx/conf.d/default.conf
echo "---=[/etc/nginx/nginx.conf]=---"
cat /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'
