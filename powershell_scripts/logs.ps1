function Write-Logs {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true, Position=0, ValueFromRemainingArguments=$true)]
        [object[]]$Message, # Accept multiple objects like Write-Host

        [Parameter(Mandatory=$false)]
        [ValidateSet('INFO', 'WARNING', 'ERROR', 'DEBUG', 'CRITICAL')]
        [string]$Level = 'INFO', # Default level is INFO

    # Write-Host parameters
        [string]$ForegroundColor = 'White',
        [string]$BackgroundColor = 'Black',
        [switch]$NoNewline
    )

    # Map levels to default colors
    $levelColors = @{
        'INFO'     = 'White'
        'WARNING'  = 'Yellow'
        'ERROR'    = 'Red'
        'DEBUG'    = 'Blue'
        'CRITICAL' = 'Magenta'
    }

    # Determine the color for the level
    $levelColor = $ForegroundColor
    if (-not $ForegroundColor -and $Level -in $levelColors.Keys) {
        $levelColor = $levelColors[$Level]
    }

    # Get the current timestamp
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

    # Prepend timestamp and level to the message
    $header = "$timestamp [$Level] -"

    # Combine header and message into a single array
    $outputMessage = @($header) + $Message

    # Pass all parameters to Write-Host
    Write-Host @outputMessage `
               -ForegroundColor $levelColor `
               -BackgroundColor $BackgroundColor `
               -NoNewline:$NoNewline
}
