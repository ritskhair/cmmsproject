from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


SiloReadingStatus = Literal["fresh", "stale", "unavailable"]


class SiloMappingCreate(BaseModel):
    device_id: str = Field(min_length=1, max_length=150)
    tag: str = Field(min_length=1, max_length=150)
    equipment_ids: list[UUID] = Field(min_length=1)
    enabled: bool = True
    display_name: str | None = Field(default=None, max_length=150)


class SiloMappingUpdate(BaseModel):
    equipment_ids: list[UUID] | None = Field(default=None, min_length=1)
    enabled: bool | None = None
    display_name: str | None = Field(default=None, max_length=150)


class SiloMappingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    device_id: str
    tag: str
    equipment_id: UUID
    enabled: bool
    display_name: str | None
    created_at: datetime
    updated_at: datetime


class SiloAffectedEquipment(BaseModel):
    id: UUID
    name: str
    asset_id: str


class SiloReadingResponse(BaseModel):
    device_id: str
    tag: str
    display_name: str | None
    equipment: list["SiloAffectedEquipment"]
    level_mm: float | None
    level_m: float | None
    capacity_pct: float | None
    sensor_status: str | None
    source_created_at: datetime | None
    requested_at: datetime
    freshness: SiloReadingStatus
    error: str | None = None


class SiloAvailableSensorResponse(BaseModel):
    device_id: str
    tag: str
    sensor_status: str | None
    source_created_at: datetime | None
    has_mapping: bool


class SiloSourceStatusResponse(BaseModel):
    configured: bool
    connected: bool
    sensor_count: int
    message: str
