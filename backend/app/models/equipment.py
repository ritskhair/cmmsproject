from datetime import datetime
import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    asset_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(100), nullable=False)
    section = Column(String(100), nullable=False)
    section_id = Column(UUID(as_uuid=True), ForeignKey("sections.id"), nullable=True)
    priority = Column(String(10), nullable=True)
    status = Column(String(20), default="Operational", nullable=False)
    last_pm = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    section_ref = relationship("Section", back_populates="machines")
    components = relationship("Component", back_populates="machine", cascade="all, delete-orphan")
