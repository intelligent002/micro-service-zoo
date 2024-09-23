#!/bin/sh

# Set a default ports if env vars are not provided
: "${NGINX_PORT:=8004}"
: "${ZOO_PYTHON_FLASK_PORT:=8101}"
: "${ZOO_TYPESCRIPT_REACT_PORT:=8102}"
: "${ZOO_PHP_LARAVEL_HTTP2FPM_PORT:=8104}"

# Logging configuration of the ports
echo "Using NGINX_PORT: $NGINX_PORT"
echo "Using ZOO_PYTHON_FLASK_PORT: $ZOO_PYTHON_FLASK_PORT"
echo "Using ZOO_PHP_LARAVEL_HTTP2FPM_PORT: $ZOO_PHP_LARAVEL_HTTP2FPM_PORT"
echo "Using ZOO_TYPESCRIPT_REACT_PORT: $ZOO_TYPESCRIPT_REACT_PORT"

# Replace placeholder with the environment variable or default value
envsubst '\
$NGINX_PORT \
$ZOO_PYTHON_FLASK_PORT \
$ZOO_PHP_LARAVEL_HTTP2FPM_PORT \
$ZOO_TYPESCRIPT_REACT_PORT \
' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Debugging substitution
cat /etc/nginx/conf.d/default.conf

# Start NGINX
nginx -g 'daemon off;'
