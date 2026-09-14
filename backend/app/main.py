from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import engine
from app.routers import accounts, auth, equipment, ewo_requests, maintenance

app = FastAPI(title="EWO Management API", version="1.0.0")

app.include_router(auth.router)
app.include_router(accounts.router)
app.include_router(equipment.router)
app.include_router(ewo_requests.router)
app.include_router(maintenance.router)

@app.get("/")
def read_root():
    return {"message": "EWO Management API is running"}

@app.get("/test-db")
def test_db():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {"database_connected": True, "result": result.scalar()}
