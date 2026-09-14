from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


Role = Literal[
    "teknisi_mtc",
    "tim_produksi",
    "teamleader_mtc",
    "teamleader_produksi",
    "manager_produksi",
    "manager_mtc",
    "general_manager",
    "super_admin",
]


class AccountCreate(BaseModel):
    username: str
    password: str
    role: Role


class AccountUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    role: Role | None = None


class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    role: Role
    created_at: datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    account: AccountResponse
