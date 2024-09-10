@echo off
docker compose -f docker-compose-dev.yaml down
docker compose -f docker-compose-dev.yaml up -d