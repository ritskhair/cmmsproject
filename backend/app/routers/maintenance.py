from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.equipment import Equipment
from app.models.ewo_maintenance import EwoMaintenance
from app.models.ewo_request import EwoRequest
from app.schemas.ewo_maintenance import EquipmentHistoryItem, EwoMaintenanceCreate, EwoMaintenanceResponse

router = APIRouter(tags=["maintenance"])
MAINTENANCE_ROLES = ("teknisi", "team_leader", "manager", "general_manager", "super_admin")


@router.post("/ewo-requests/{ewo_id}/maintenance", response_model=EwoMaintenanceResponse, status_code=201)
def create_maintenance(
    ewo_id: UUID,
    payload: EwoMaintenanceCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*MAINTENANCE_ROLES)),
):
    if payload.end_time < payload.start_time:
        raise HTTPException(status_code=422, detail="end_time must be after start_time")
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")

    maintenance = EwoMaintenance(ewo_request_id=ewo.id, **payload.model_dump())
    db.add(maintenance)
    ewo.status = "completed"
    db.flush()

    latest_end = (
        db.query(func.max(EwoMaintenance.end_time))
        .join(EwoRequest, EwoRequest.id == EwoMaintenance.ewo_request_id)
        .filter(EwoRequest.equipment_id == ewo.equipment_id)
        .scalar()
    )
    equipment = db.query(Equipment).filter(Equipment.id == ewo.equipment_id).first()
    equipment.last_pm = latest_end
    db.commit()
    db.refresh(maintenance)
    return maintenance


@router.get("/equipment/{equipment_id}/history", response_model=list[EquipmentHistoryItem])
def equipment_history(
    equipment_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles(
        "teknisi", "team_leader", "manager", "general_manager", "super_admin",
    )),
):
    if not db.query(Equipment).filter(Equipment.id == equipment_id).first():
        raise HTTPException(status_code=404, detail="Equipment not found")
    rows = (
        db.query(EwoMaintenance, EwoRequest.ewo_number, EwoRequest.equipment_id)
        .join(EwoRequest, EwoRequest.id == EwoMaintenance.ewo_request_id)
        .filter(EwoRequest.equipment_id == equipment_id)
        .order_by(EwoMaintenance.end_time.desc())
        .all()
    )
    return [
        {
            **maintenance.__dict__,
            "ewo_number": ewo_number,
            "equipment_id": history_equipment_id,
        }
        for maintenance, ewo_number, history_equipment_id in rows
    ]
