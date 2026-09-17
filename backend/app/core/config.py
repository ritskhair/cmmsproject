from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
OPERATOR_ALLOWED_NETWORKS = os.getenv("OPERATOR_ALLOWED_NETWORKS", "127.0.0.1/32,::1/128")
CORS_ALLOWED_ORIGINS = [
	origin.strip()
	for origin in os.getenv(
		"CORS_ALLOWED_ORIGINS",
		"http://localhost:5173,http://127.0.0.1:5173",
	).split(",")
	if origin.strip()
]