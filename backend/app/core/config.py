import os
from pathlib import Path

from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
	raise RuntimeError(
		"DATABASE_URL belum diatur. Buat backend/.env dari backend/.env.example "
		"dan isi URL PostgreSQL yang valid."
	)

DB_BOOTSTRAP_ADMIN_DATABASE = os.getenv("DB_BOOTSTRAP_ADMIN_DATABASE", "postgres").strip()
if not DB_BOOTSTRAP_ADMIN_DATABASE:
	raise RuntimeError("DB_BOOTSTRAP_ADMIN_DATABASE tidak boleh kosong.")

OPERATOR_ALLOWED_NETWORKS = os.getenv("OPERATOR_ALLOWED_NETWORKS", "127.0.0.1/32,::1/128")
CORS_ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.getenv(
		"CORS_ALLOWED_ORIGINS",
		"http://localhost:5173,http://127.0.0.1:5173,http://10.23.21.168:8080",
	).split(",")
	if origin.strip()
]

INITIAL_ADMIN_USERNAME = os.getenv("INITIAL_ADMIN_USERNAME", "").strip()
INITIAL_ADMIN_PASSWORD = os.getenv("INITIAL_ADMIN_PASSWORD", "")

if bool(INITIAL_ADMIN_USERNAME) != bool(INITIAL_ADMIN_PASSWORD):
	raise RuntimeError(
		"INITIAL_ADMIN_USERNAME dan INITIAL_ADMIN_PASSWORD harus diatur bersama-sama."
	)