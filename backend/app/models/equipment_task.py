from datetime import datetime
import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class EquipmentTaskCatalog(Base):
    __tablename__ = "equipment_task_catalog"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    equipment_id = Column(UUID(as_uuid=True), ForeignKey("equipment.id"), nullable=False)
    task_list = Column(Text, nullable=False)
    active = Column(Boolean, default=False, nullable=False)
    review_status = Column(String(20), default="pending", nullable=False)
    source = Column(String(30), default="import", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
