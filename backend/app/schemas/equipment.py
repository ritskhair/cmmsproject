from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


EquipmentStatus = Literal["Operational", "Warning", "Critical"]


class EquipmentCreate(BaseModel):
    asset_id: str
    name: str
    type: str
    section: str
    status: EquipmentStatus = "Operational"


class EquipmentUpdate(BaseModel):
    asset_id: str | None = None
    name: str | None = None
    type: str | None = None
    section: str | None = None
    status: EquipmentStatus | None = None


class EquipmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    asset_id: str
    name: str
    type: str
    section: str
    status: EquipmentStatus
    last_pm: datetime | None
    created_at: datetime
