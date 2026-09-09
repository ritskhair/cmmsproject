from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class AssetCreate(BaseModel):
    asset_code: str
    name: str
    location: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = "active"

class AssetResponse(BaseModel):
    id: UUID
    asset_code: str
    name: str
    location: Optional[str]
    category: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True