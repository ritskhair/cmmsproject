from datetime import datetime
from enum import Enum
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


EwoStatus = Literal["pending", "in_progress", "completed"]
FailureType = Literal["total", "partial"]


class Section(str, Enum):
    section_1 = "1"
    section_2 = "2"
    section_3 = "3"
    section_4 = "4"
    section_5 = "5"


class EwoRequestCreate(BaseModel):
    section: Section
    requestor_name: str
    department: str
    equipment_id: UUID
    shift: str
    team_leader_name: str
    failure_type: FailureType
    task_list: str
    special_note: str | None = None


class EwoRequestUpdate(BaseModel):
    section: Section | None = None
    requestor_name: str | None = None
    department: str | None = None
    equipment_id: UUID | None = None
    shift: str | None = None
    team_leader_name: str | None = None
    failure_type: FailureType | None = None
    task_list: str | None = None
    special_note: str | None = None


class EwoRequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    ewo_number: str
    section: Section
    requestor_name: str
    department: str
    equipment_id: UUID
    shift: str
    team_leader_name: str
    failure_type: FailureType
    task_list: str
    special_note: str | None
    status: EwoStatus
    created_at: datetime
