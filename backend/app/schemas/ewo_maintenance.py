from datetime import datetime
from uuid import UUID
from typing import Literal

from pydantic import BaseModel, ConfigDict


class EwoMaintenanceCreate(BaseModel):
    condition_after_repair: str
    root_cause: str
    tools_used: str
    failure_category: Literal["electrical", "mechanical"]


class EwoMaintenanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ewo_request_id: UUID
    code_approval: str | None
    start_time: datetime | None
    end_time: datetime | None
    condition_after_repair: str
    root_cause: str | None
    tools_used: str | None
    failure_type: Literal["total", "partial"] | None
    failure_category: Literal["electrical", "mechanical"] | None
    created_at: datetime


class EquipmentHistoryItem(EwoMaintenanceResponse):
    ewo_number: str
    equipment_id: UUID
