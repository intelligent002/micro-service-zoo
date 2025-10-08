#!/usr/bin/pwsh

Set-Location D:\www\testedrecruits\micro-service-zoo\helm

# First thing first - prerequisites ...
. ./../powershell_scripts/logs.ps1

Write-Logs "Cleanup old dependency charts"

Get-ChildItem -Path . -Recurse -Filter *.tgz | Remove-Item -Force

Write-Logs "Updating helm dependencies per all charts"

$charts = @(
  "zoo-mysql",
  "zoo-php-laravel",
  "zoo-php-laravel-http2fpm",
  "zoo-python-fastapi",
  "zoo-python-flask",
  "zoo-typescript-react",
  "zoo-all"
)

foreach ($chart in $charts) {
    Write-Logs "Updating $chart"
    helm dependency update "D:\www\testedrecruits\micro-service-zoo\helm\$chart"
}

Write-logs "deploying the zoo-all"

Set-Location D:\www\testedrecruits\micro-service-zoo\helm
helm upgrade --install stage .\zoo-all\ --namespace zoo --create-namespace

# helm uninstall stage --namespace zoo