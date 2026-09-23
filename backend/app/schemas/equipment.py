from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


EquipmentStatus = Literal["Operational", "Warning", "Critical"]


class Section(str, Enum):
    section_1 = "1"
    section_2 = "2"
    section_3 = "3"
    section_4 = "4"
    section_5 = "5"


class EquipmentCreate(BaseModel):
    asset_id: str
    name: str
    type: str
    section: Section
    status: EquipmentStatus = "Operational"


class EquipmentUpdate(BaseModel):
    asset_id: str | None = None
    name: str | None = None
    type: str | None = None
    section: Section | None = None
    status: EquipmentStatus | None = None


class EquipmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    asset_id: str
    name: str
    type: str
    section: Section
    section_id: UUID | None
    status: EquipmentStatus
    last_pm: datetime | None
    created_at: datetime


class SectionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    name: str
    active: bool


class ComponentCreate(BaseModel):
    name: str
    type: str
    status: EquipmentStatus = "Operational"


class ComponentUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    status: EquipmentStatus | None = None


class ComponentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    asset_id: str | None
    name: str
    type: str
    status: EquipmentStatus
    machine_id: UUID
    created_at: datetime
