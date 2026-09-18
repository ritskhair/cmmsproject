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

OPERATOR_ALLOWED_NETWORKS = os.getenv("OPERATOR_ALLOWED_NETWORKS", "127.0.0.1/32,::1/128")
CORS_ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.getenv(
		"CORS_ALLOWED_ORIGINS",
		"http://localhost:5173,http://127.0.0.1:5173",
	).split(",")
	if origin.strip()
]