# Prepare for cross-os work
function Get-OS-Type
{
    if ($IsWindows)
    {
        $OS = "Windows"
    }
    elseif ($IsLinux)
    {
        $OS = "Linux"
    }
    elseif ($IsMacOS)
    {
        $OS = "Darwin"
    }
    else
    {
        $OS = "Unknown"
    }
    Write-Logs "Determinated OS is [$OS]" -ForegroundColor Green
    return $OS
}

$OS_Type = Get-OS-Type
