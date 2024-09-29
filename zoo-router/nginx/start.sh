#!/bin/sh

# Set a default ports if env vars are not provided
: "${NGINX_PORT:=8004}"
: "${ZOO_PYTHON_FASTAPI_PORT:=8001}"
: "${ZOO_TYPESCRIPT_REACT_PORT:=8002}"
: "${ZOO_PHP_LARAVEL_HTTP2FPM_PORT:=8004}"
: "${SERVICE_NAME:=service}"
: "${ENVIRONMENT:=undefined}"

# Logging configuration of the ports
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using ZOO_PYTHON_FASTAPI_PORT: $ZOO_PYTHON_FLASK_PORT"
echo "Using ZOO_TYPESCRIPT_REACT_PORT: $ZOO_TYPESCRIPT_REACT_PORT"
echo "Using ZOO_PHP_LARAVEL_HTTP2FPM_PORT: $ZOO_PHP_LARAVEL_HTTP2FPM_PORT"
echo "Using SERVICE_NAME: $SERVICE_NAME"
echo "Using ENVIRONMENT: $ENVIRONMENT"

# Replace placeholder with the environment variable or default value
envsubst '\
$NGINX_PORT \
$ZOO_PYTHON_FASTAPI_PORT \
$ZOO_PHP_LARAVEL_HTTP2FPM_PORT \
$ZOO_TYPESCRIPT_REACT_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Replace placeholder with the environment variable or default value
envsubst '\
$NGINX_PORT \
$ZOO_PYTHON_FASTAPI_PORT \
$ZOO_PHP_LARAVEL_HTTP2FPM_PORT \
$ZOO_TYPESCRIPT_REACT_PORT \
$SERVICE_NAME \
$ENVIRONMENT \
' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

rm /etc/nginx/conf.d/default.conf.template
rm /etc/nginx/nginx.conf.template

# Debugging substitutions
# cat /etc/nginx/conf.d/default.conf
# cat /etc/nginx/nginx.conf

# Start NGINX
nginx -g 'daemon off;'
