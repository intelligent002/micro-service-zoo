#!/bin/bash
set -euo pipefail
# Detect the OS and set the Docker log path accordingly

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    DEFAULT_LOG_PATH="/var/lib/docker/containers"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    DEFAULT_LOG_PATH="$HOME/Library/Containers/com.docker.docker/Data/vms/0/data/docker/containers"
elif [[ "$OSTYPE" == "msys"* ]]; then
    DEFAULT_LOG_PATH="/mnt/wsl/docker-desktop-data/data/docker/containers"
else
    echo "Unsupported OS - $OSTYPE"
    exit 1
fi

# Allow override through environment variable
DOCKER_LOG_PATH=${DOCKER_LOG_PATH:-$DEFAULT_LOG_PATH}

# Validate path exists
if [ ! -d "$DOCKER_LOG_PATH" ]; then
    echo "Warning: Docker log path $DOCKER_LOG_PATH does not exist"
fi
export DOCKER_LOG_PATH

# Stop Docker Compose
docker compose down --remove-orphans