from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EwoMaintenanceCreate(BaseModel):
    code_approval: str
    start_time: datetime
    end_time: datetime
    condition_after_repair: str


class EwoMaintenanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ewo_request_id: UUID
    code_approval: str
    start_time: datetime
    end_time: datetime
    condition_after_repair: str
    created_at: datetime


class EquipmentHistoryItem(EwoMaintenanceResponse):
    ewo_number: str
    equipment_id: UUID
