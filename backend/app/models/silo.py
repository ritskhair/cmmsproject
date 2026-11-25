from datetime import datetime, timezone
import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class SiloSensorMapping(Base):
    __tablename__ = "silo_sensor_mappings"
    __table_args__ = (
        UniqueConstraint("device_id", "tag", "equipment_id", name="uq_silo_sensor_mapping_relationship"),
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    device_id = Column(String(150), nullable=False)
    tag = Column(String(150), nullable=False)
    equipment_id = Column(UUID(as_uuid=True), ForeignKey("equipment.id", ondelete="RESTRICT"), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    display_name = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    equipment = relationship("Equipment")
