# test if command available in path
function Test-CommandExists
{
    param ([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return ($? -eq $true)
}

# Confirm the version of powershell
function Test-PrerequisitePowershell
{
    if ($PSVersionTable.PSEdition -eq "Core" -and $PSVersionTable.PSVersion.Major -gt 6)
    {
        Write-Logs ([char]0x2713) "PowerShell Core 7+ is available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "PowerShell Core or PowerShell 7+ is required." -level 'ERROR'
    Write-Logs "`nYour current version is:"
    $PSVersionTable
    exit 1
}

# Confirm the presence of Docker Engine
function Test-PrerequisiteDocker
{
    if (Test-CommandExists -Command "docker")
    {
        Write-Logs ([char]0x2713) "Docker Engine is available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "Docker Engine is not installed or not available in PATH." -level 'ERROR'
    exit 1
}

# Confirm the presence of Docker Compose
function Test-PrerequisiteDockerCompose
{
    if (Test-CommandExists -Command "docker-compose")
    {
        Write-Logs ([char]0x2713) "Docker Compose available." -ForegroundColor Green
        return
    }
    if (docker compose version -ErrorAction SilentlyContinue)
    {
        Write-Logs ([char]0x2713) "Docker Compose (as plugin) available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "Docker Compose is not installed or not available in PATH." -level 'ERROR'
    exit 1
}

function Test-PrerequisiteDockerIsRunning
{
    try
    {
        $null = docker info 2>&1
        if ($LASTEXITCODE -ne 0)
        {
            Write-Logs ([char]120) "Docker daemon is not running" -Level 'ERROR'
            exit 1
        }
        Write-Logs ([char]0x2713) "Docker Engine is running." -ForegroundColor Green
    }
    catch
    {
        Write-Logs "Failed to connect to Docker daemon: $_" -Level 'ERROR'
        exit 1
    }
}

# confirm all prerequisites are in place
function Test-Prerequisites
{
    Test-PrerequisitePowershell
    Test-PrerequisiteDocker
    Test-PrerequisiteDockerCompose
    Test-PrerequisiteDockerIsRunning

    Write-Logs "All prerequisites are OK. We're good to go!" -ForegroundColor Green
}

Test-Prerequisites