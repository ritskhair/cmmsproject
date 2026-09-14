from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, String
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(100), nullable=False)
    section = Column(String(100), nullable=False)
    status = Column(String(20), default="Operational", nullable=False)
    last_pm = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
