#!/bin/bash
# Detect the OS and set the Docker log path accordingly

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    export DOCKER_LOG_PATH="/var/lib/docker/containers"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    export DOCKER_LOG_PATH="/var/lib/docker/containers"
elif [[ "$OSTYPE" == "msys"* ]]; then
    export DOCKER_LOG_PATH="/mnt/wsl/docker-desktop-data/data/docker/containers"
else
    echo "Unsupported OS"
    exit 1
fi

# Start Docker Compose
docker-compose up