from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class EwoRequest(Base):
    __tablename__ = "ewo_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ewo_number = Column(String(30), unique=True, nullable=False)
    requestor_name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    section = Column(String(10), nullable=False)
    equipment_id = Column(UUID(as_uuid=True), ForeignKey("equipment.id"), nullable=False)
    component_id = Column(UUID(as_uuid=True), ForeignKey("components.id"), nullable=True)
    shift = Column(String(50), nullable=False)
    team_leader_name = Column(String(150), nullable=False)
    failure_type = Column(String(20), nullable=False)
    task_list = Column(Text, nullable=False)
    special_note = Column(Text, nullable=True)
    status = Column(String(20), default="pending", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    equipment = relationship("Equipment")
    component = relationship("Component")
    maintenance = relationship(
        "EwoMaintenance", back_populates="ewo_request", cascade="all, delete-orphan"
    )
