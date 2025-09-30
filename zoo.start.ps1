#!/usr/bin/pwsh

# First thing first - prerequisites ...
. ./powershell_scripts/logs.ps1
. ./powershell_scripts/self_elevation.ps1
. ./powershell_scripts/get_os.ps1
. ./powershell_scripts/test_prerequisites.ps1


# Define default docker paths
$paths = @{
    'Linux' = @(
        '/var/lib/docker/containers'
    )
    'Darwin' = @(
        '/var/lib/docker/containers'
    )
    'Windows' = @(
        'C:\ProgramData\Docker\containers',
        '/mnt/wsl/docker-desktop-data/data/docker/containers',
        '/wsl$/docker-desktop/mnt/docker-desktop-disk/data/docker/containers'
    )
}

# Boil out if no such OS paths
if (-not $paths.ContainsKey($OS_Type))
{
    Write-Logs "Unsupported OS: [$OS_Type]" -level 'ERROR'
    exit 1
}

# Try to get the path of the containers
$validPath = $paths[$OS_Type] | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $validPath)
{
    Write-Logs "No valid Docker container path found. Specify your paths." -level 'ERROR'
    #exit 1
}
$env:DOCKER_LOG_PATH = $validPath

# enable docker swarm mode
docker swarm init

# create zoo network
docker network create --driver overlay --attachable --subnet 172.30.1.0/24 --gateway 172.30.1.1 zoo

# deploy microservices
docker stack deploy -c docker-swarm.yml zoo --detach=false