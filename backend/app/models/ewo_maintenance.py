from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class EwoMaintenance(Base):
    __tablename__ = "ewo_maintenance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ewo_request_id = Column(UUID(as_uuid=True), ForeignKey("ewo_requests.id"), nullable=False)
    code_approval = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    condition_after_repair = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ewo_request = relationship("EwoRequest", back_populates="maintenance")
