Set-Location "$PSScriptRoot\..\backend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
if (-not (Test-Path .\venv\Scripts\python.exe)) {
	throw "Backend virtual environment tidak ditemukan. Buat dengan: py -3 -m venv venv"
}
if (-not (Test-Path .\.env)) {
	throw "backend/.env tidak ditemukan. Salin backend/.env.example menjadi backend/.env terlebih dahulu."
}
. .\venv\Scripts\Activate.ps1
$env:OPERATOR_ALLOWED_NETWORKS = "127.0.0.1/32,::1/128"
$env:CORS_ALLOWED_ORIGINS = "http://127.0.0.1:5173,http://localhost:5173"
Write-Host "Backend LOCAL: http://127.0.0.1:8000"
Write-Host "Health check:  http://127.0.0.1:8000/health"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
