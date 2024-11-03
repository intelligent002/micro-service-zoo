# PowerShell script to handle the OS detection and Docker Compose command

$OSTYPE = $env:OS

if ($OSTYPE -like "*Linux*") {
    $env:DOCKER_LOG_PATH = "/var/lib/docker/containers"
} elseif ($OSTYPE -like "*Darwin*") {
    $env:DOCKER_LOG_PATH = "/var/lib/docker/containers"
} elseif ($OSTYPE -like "*Windows*") {
    $env:DOCKER_LOG_PATH = "/mnt/wsl/docker-desktop-data/data/docker/containers"
} else {
    Write-Host "Unsupported OS"
    exit 1
}

# Run Docker Compose
docker-compose up #--build