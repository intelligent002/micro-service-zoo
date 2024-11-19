# PowerShell script to handle the OS detection and Docker Compose command

# Self elevate
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process PowerShell -Verb RunAs "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$pwd'; & '$PSCommandPath';`"";
    exit;
}

# Add timestamp to all output
function Write-Log {
    param($Message)
    Write-Host "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - $Message"
}

# Define default paths
$paths = @{
    'C:\ProgramData\Docker\containers',
    '/mnt/wsl/docker-desktop-data/data/docker/containers'
}

# Boil out if no such OS paths
if (-not $paths.ContainsKey($OSTYPE)) {
    Write-Log "Unsupported OS: $OSTYPE"
    exit 1
}

# For Windows, try both native and WSL paths
if ($OSTYPE -eq 'Windows_NT') {
    $validPath = $paths[$OSTYPE] | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $validPath) {
        Write-Log "No valid Docker container path found. Is Docker running?"
        exit 1
    }
    $env:DOCKER_LOG_PATH = $validPath
} else {
    $env:DOCKER_LOG_PATH = $paths[$OSTYPE]
}

# Validate path exists
if (-not (Test-Path $env:DOCKER_LOG_PATH)) {
    Write-Log "Docker container path not found: $env:DOCKER_LOG_PATH"
    Write-Log "Is Docker installed and running?"
    exit 1
}


# Run Docker Compose
docker-compose up --build -d