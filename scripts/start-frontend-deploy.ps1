param(
  [Parameter(Mandatory = $true)]
  [string]$BackendHost,
  [string]$FrontendHost = "0.0.0.0",
  [int]$BackendPort = 8000,
  [int]$FrontendPort = 5173
)

Set-Location "$PSScriptRoot\..\frontend"
if (-not (Test-Path .\node_modules)) {
  throw "node_modules tidak ditemukan. Jalankan npm install di folder frontend terlebih dahulu."
}
$env:VITE_API_BASE_URL = "http://$BackendHost`:$BackendPort"
Write-Host "Frontend DEPLOY bind: http://$FrontendHost`:$FrontendPort"
Write-Host "Open in browser:     http://<FRONTEND_IP>`:$FrontendPort"
Write-Host "API target:          $env:VITE_API_BASE_URL"
npm run dev -- --host $FrontendHost --port $FrontendPort
