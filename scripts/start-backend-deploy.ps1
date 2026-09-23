param(
  [string]$Host = "0.0.0.0",
  [int]$Port = 8000,
  [Parameter(Mandatory = $true)]
  [string]$AllowedNetworks,
  [Parameter(Mandatory = $true)]
  [string]$CorsOrigins
)

Set-Location "$PSScriptRoot\..\backend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
if (-not (Test-Path .\venv\Scripts\python.exe)) {
  throw "Backend virtual environment tidak ditemukan. Buat dengan: py -3 -m venv venv"
}
if (-not (Test-Path .\.env)) {
  throw "backend/.env tidak ditemukan. Salin backend/.env.deploy.example menjadi backend/.env terlebih dahulu."
}
. .\venv\Scripts\Activate.ps1
$env:OPERATOR_ALLOWED_NETWORKS = $AllowedNetworks
$env:CORS_ALLOWED_ORIGINS = $CorsOrigins
Write-Host "Backend DEPLOY bind: http://$Host`:$Port"
Write-Host "Operator networks:  $env:OPERATOR_ALLOWED_NETWORKS"
Write-Host "Allowed origins:    $env:CORS_ALLOWED_ORIGINS"
Write-Host "Health check dari jaringan: http://<BACKEND_IP>`:$Port/health"
python -m uvicorn app.main:app --host $Host --port $Port
