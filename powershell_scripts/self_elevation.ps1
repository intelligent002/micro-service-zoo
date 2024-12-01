# Self elevate with cross-platform support - test
function Test-AdminPrivileges
{
    if ($IsWindows)
    {
        return ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    }
    elseif ($IsLinux -or $IsMacOS)
    {
        return (id -u) -eq 0
    }
    return $false
}

# Self elevate with cross-platform support - request
function Request-AdminPrivileges
{
    if ($IsWindows)
    {
        try
        {
            Start-Process PowerShell -Verb RunAs "-NoProfile -ExecutionPolicy Bypass -Command `"cd '$pwd'; & '$PSCommandPath';`"" -Wait
            exit $LASTEXITCODE
        }
        catch
        {
            Write-Logs "Failed to elevate privileges: $_" -level 'error'
            exit 1
        }
    }
    else
    {
        Write-Logs "This script requires root privileges. Please run with sudo." -level 'error'
        exit 1
    }
}

# Self elevate with cross-platform support
if (-not (Test-AdminPrivileges))
{
    Request-AdminPrivileges
}
