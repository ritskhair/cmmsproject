Set-Location "$PSScriptRoot\..\frontend"
if (-not (Test-Path .\node_modules)) {
	throw "node_modules tidak ditemukan. Jalankan npm install di folder frontend terlebih dahulu."
}
$env:VITE_API_BASE_URL = "http://127.0.0.1:8000"
Write-Host "Frontend LOCAL: http://127.0.0.1:5173"
Write-Host "API target:     $env:VITE_API_BASE_URL"
npm run dev -- --host 127.0.0.1
