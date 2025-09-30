# test if command available in path
function Test-CommandExists {
    [CmdletBinding()]
    param (
        [string]$Command
    )
    try {
        $null = Get-Command $Command -ErrorAction SilentlyContinue
        return $true
    } catch {
        return $false
    }
}

# Confirm the version of powershell
function Test-PrerequisitePowershell
{
    if ($PSVersionTable.PSEdition -eq "Core" -and $PSVersionTable.PSVersion.Major -gt 6)
    {
        Write-Logs ([char]0x2713) "PowerShell Core 7+ is available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "PowerShell Core or PowerShell 7+ is required." -level 'error'
    Write-Logs "`nYour current version is:"
    $PSVersionTable
    exit 1
}

# Confirm the presence of Docker Engine
function Test-PrerequisiteDocker
{
    if (Test-CommandExists "docker")
    {
        Write-Logs ([char]0x2713) "Docker Engine is available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "Docker Engine is not installed or not available in PATH." -level 'error'
    exit 1
}

function Test-DockerCompose {
    [CmdletBinding()]
    param ()

    try {
        Write-logs "Checking for Docker Compose plugin..." -level 'debug'
        docker compose --version
        if ($LASTEXITCODE -ne 0) {
            throw "Вocker compose plugin not found or failed"
        }
        Write-Verbose "Docker Compose plugin is supported."
        return "plugin"
    } catch {
        Write-Verbose "Docker Compose plugin not found. Checking for standalone binary..."
        try {
            docker-compose --version
            if ($LASTEXITCODE -ne 0) {
                throw "docker-compose not found or failed"
            }
            Write-Verbose "Standalone Docker Compose binary is supported."
            return "standalone"
        } catch {
            Write-Error "Neither Docker Compose plugin nor standalone binary is available."
            return $false
        }
    }
}


# Confirm the presence of Docker Compose
function Test-PrerequisiteDockerCompose
{
    $result = Test-DockerCompose -verbose
    if ($result -eq "plugin") {
        Write-Host "Docker Compose plugin is supported." -ForegroundColor Green
    } elseif ($result -eq "standalone") {
        Write-Host "Standalone Docker Compose binary is supported." -ForegroundColor Yellow
    } else {
        Write-Host "Docker Compose is not supported." -ForegroundColor Red
    }

    if (-not(Test-CommandExists "docker-compose"))
    {
        Write-Logs ([char]0x2713) "Docker Compose is available." -ForegroundColor Green
        return
    }

    if (Test-CommandExists "docker compose version")
    {
        Write-Logs ([char]0x2713) "Docker Compose (as plugin) is available." -ForegroundColor Green
        return
    }

    Write-Logs ([char]120) "Docker Compose is not installed or not available in PATH." -level 'error'
    exit 1
}

function Test-PrerequisiteDockerIsRunning
{
    try
    {
        $null = docker info 2>&1
        if ($LASTEXITCODE -ne 0)
        {
            Write-Logs ([char]120) "Docker Engine is not running" -level 'error'
            exit 1
        }
        Write-Logs ([char]0x2713) "Docker Engine is running." -ForegroundColor Green
    }
    catch
    {
        Write-Logs "Failed to connect to Docker daemon: $_" -level 'error'
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