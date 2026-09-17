from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class Role(str, Enum):
    teknisi = "teknisi"
    team_leader = "team_leader"
    manager = "manager"
    general_manager = "general_manager"
    super_admin = "super_admin"


class AccountCreate(BaseModel):
    username: str
    password: str
    department: str | None = None
    position: str | None = None
    role: Role


class AccountUpdate(BaseModel):
    username: str | None = None
    password: str | None = None
    department: str | None = None
    position: str | None = None
    role: Role | None = None


class AccountResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    department: str | None
    position: str | None
    role: Role
    created_at: datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    account: AccountResponse | None = None
    role: Role


class OperatorLoginResponse(BaseModel):
    token: str
    role: str = "operator"
