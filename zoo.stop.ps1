#!/usr/bin/pwsh

# remove zoo stack
docker stack rm zoo
# remove zoo network
docker network rm zoo
# leave docker swarm mode
docker swarm leave --force