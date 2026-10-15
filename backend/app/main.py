from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import CORS_ALLOWED_ORIGINS
from app.core.database import engine
from app.routers import accounts, auth, dashboard, equipment, ewo_requests, maintenance

app = FastAPI(title="CMMS", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS if CORS_ALLOWED_ORIGINS else ["*"],
    allow_origin_regex=r"^https?://.*$",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(equipment.router)
app.include_router(ewo_requests.router)
app.include_router(maintenance.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {"message": "EWO Management API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "cmms-backend"}

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_connected": True, "result": result.scalar()}
