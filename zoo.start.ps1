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
    Write-Logs "Unsupported OS: [$OS_Type]"
    exit 1
}

# Try to get the path of the contaiers
$validPath = $paths[$OS_Type] | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $validPath)
{
    Write-Log "No valid Docker container path found. Specify your paths."
    exit 1
}
$env:DOCKER_LOG_PATH = $validPath

# Run Docker Compose
docker-compose up --build -d