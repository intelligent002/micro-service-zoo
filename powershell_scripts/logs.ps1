function Write-Logs
{
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true, Position = 0, ValueFromRemainingArguments = $true)]
        [object[]]$Message,

        [Parameter(Mandatory = $false)]
        [ValidateSet('INFO', 'WARNING', 'ERROR', 'DEBUG', 'CRITICAL')]
        [string]$Level = 'INFO',

        [Parameter(Mandatory = $false)]
        [ValidateSet('Black', 'DarkBlue', 'DarkGreen', 'DarkCyan', 'DarkRed', 'DarkMagenta', 'DarkYellow', 'Gray', 'DarkGray', 'Blue', 'Green', 'Cyan', 'Red', 'Magenta', 'Yellow', 'White')]
        [string]$ForegroundColor,

        [Parameter(Mandatory = $false)]
        [ValidateSet('Black', 'DarkBlue', 'DarkGreen', 'DarkCyan', 'DarkRed', 'DarkMagenta', 'DarkYellow', 'Gray', 'DarkGray', 'Blue', 'Green', 'Cyan', 'Red', 'Magenta', 'Yellow', 'White')]
        [string]$BackgroundColor,

        [switch]$NoNewline
    )

    # Hashtable for levels and their default colors
    $levelConfig = @{
        'INFO' = 'White'
        'WARNING' = 'Yellow'
        'ERROR' = 'Red'
        'DEBUG' = 'Blue'
        'CRITICAL' = 'Magenta'
    }

    # Convert Level to uppercase for output consistency
    $Level = $Level.ToUpper()

    # Default or validate ForegroundColor
    if (-not $ForegroundColor)
    {
        $ForegroundColor = $levelConfig[$Level]
    }

    # Default or validate BackgroundColor
    if (-not $BackgroundColor)
    {
        $BackgroundColor = 'Black'
    }

    # Get the current timestamp
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    # Prepend timestamp and level to the message
    $header = "$timestamp [$Level] -"

    # Combine header and message
    $outputMessage = @($header) + $Message

    # Pass all parameters to Write-Host
    Write-Host @outputMessage `
               -ForegroundColor $ForegroundColor `
               -BackgroundColor $BackgroundColor `
               -NoNewline:$NoNewline
}
