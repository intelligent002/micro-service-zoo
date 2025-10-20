#!/usr/bin/pwsh

param(
    [string]$Path,
    [string[]]$Exclude = @("*.tgz", "*.zip")
)

if (-not $Path) {
    Write-Host "Usage: .\list-files.ps1 -Path <folder_path> [-Exclude '*.tgz','*.zip']"
    Write-Host "Example: .\list-files.ps1 -Path 'C:\Projects\helm' -Exclude '*.tgz','*.log'"
    exit 1
}

if (-not (Test-Path $Path)) {
    Write-Host "Error: The specified path '$Path' does not exist."
    exit 1
}

$basePath = (Resolve-Path -LiteralPath $Path).Path.TrimEnd('\','/')

Get-ChildItem -Path $Path -Recurse -File | Where-Object {
    $skip = $false
    foreach ($mask in $Exclude) {
        if ($_.Name -like $mask) { $skip = $true; break }
    }
    -not $skip
} | ForEach-Object {
    $full = $_.FullName
    $relative = [System.IO.Path]::GetRelativePath($basePath, $full) -replace '\\','/'
    Write-Host "file - ${relative}:"
    Get-Content -LiteralPath $full
    Write-Host ""
}
