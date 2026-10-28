from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.equipment import Equipment
from app.models.component import Component
from app.models.ewo_request import EwoRequest
from app.models.equipment_task import EquipmentTaskCatalog
from app.schemas.ewo_request import (
    EwoApprovalUpdate,
    EwoRequestCreate,
    EwoRequestResponse,
    EwoRequestUpdate,
    EwoStatus,
)

router = APIRouter(prefix="/ewo-requests", tags=["ewo-requests"])
STATUS_ROLES = ("teknisi", "team_leader", "manager", "general_manager", "super_admin")
READ_ROLES = STATUS_ROLES
CREATE_ROLES = (*READ_ROLES, "operator")
OPERATOR_APPROVAL_ROLES = CREATE_ROLES


def next_ewo_number(db: Session) -> str:
    year = datetime.utcnow().year
    db.execute(text("SELECT pg_advisory_xact_lock(hashtext(:key))"), {"key": f"ewo-number-{year}"})
    count = db.query(EwoRequest).filter(EwoRequest.ewo_number.like(f"EWO-{year}-%")).count()
    return f"EWO-{year}-{count + 1:04d}"


@router.get("", response_model=list[EwoRequestResponse])
def list_ewo_requests(db: Session = Depends(get_db), _=Depends(require_roles(*READ_ROLES))):
    return db.query(EwoRequest).order_by(EwoRequest.created_at.desc()).all()


@router.get("/operator/open", response_model=list[EwoRequestResponse])
def list_operator_open_ewo(
    db: Session = Depends(get_db),
    _=Depends(require_roles(*OPERATOR_APPROVAL_ROLES)),
):
    return (
        db.query(EwoRequest)
        .filter(EwoRequest.status == "pending")
        .order_by(EwoRequest.created_at.asc())
        .all()
    )


@router.post("", response_model=EwoRequestResponse, status_code=201)
def create_ewo_request(payload: EwoRequestCreate, db: Session = Depends(get_db), _=Depends(require_roles(*CREATE_ROLES))):
    equipment = db.query(Equipment).filter(Equipment.id == payload.equipment_id, Equipment.section == payload.section.value).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found in selected section")

    if payload.component_id is not None:
        # Standard component validation
        component = db.query(Component).filter(Component.id == payload.component_id).first()
        if not component or component.machine_id != payload.equipment_id:
            raise HTTPException(status_code=404, detail="Component is not part of the selected machine and section")
    else:
        # "Other" component — description required
        if not payload.component_other_description or not payload.component_other_description.strip():
            raise HTTPException(status_code=422, detail="component_other_description is required when component_id is not provided")

    values = payload.model_dump()
    task_catalog_id = values.get("task_catalog_id")
    if task_catalog_id:
        task = db.query(EquipmentTaskCatalog).filter(
            EquipmentTaskCatalog.id == task_catalog_id,
            EquipmentTaskCatalog.equipment_id == payload.equipment_id,
            EquipmentTaskCatalog.active.is_(True),
            EquipmentTaskCatalog.review_status == "approved",
        ).first()
        if not task:
            raise HTTPException(status_code=404, detail="Task list tidak tersedia untuk equipment ini")
        values["task_list"] = task.task_list
    elif not values.get("task_list") or not values["task_list"].strip():
        raise HTTPException(status_code=422, detail="Task list wajib dipilih atau diisi melalui Others")
    else:
        candidate = db.query(EquipmentTaskCatalog).filter(
            EquipmentTaskCatalog.equipment_id == payload.equipment_id,
            EquipmentTaskCatalog.task_list == values["task_list"].strip(),
        ).first()
        if not candidate:
            db.add(EquipmentTaskCatalog(
                equipment_id=payload.equipment_id,
                task_list=values["task_list"].strip(),
                active=False,
                review_status="pending",
                source="ewo_others",
            ))
    ewo = EwoRequest(ewo_number=next_ewo_number(db), **values)
    db.add(ewo)
    db.commit()
    db.refresh(ewo)
    return ewo



@router.get("/{ewo_id}", response_model=EwoRequestResponse)
def get_ewo_request(ewo_id: UUID, db: Session = Depends(get_db), _=Depends(require_roles(*READ_ROLES))):
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")
    return ewo


@router.patch("/{ewo_id}/approve", response_model=EwoRequestResponse)
def approve_ewo_request(
    ewo_id: UUID,
    payload: EwoApprovalUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*OPERATOR_APPROVAL_ROLES)),
):
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")
    if ewo.status != "pending":
        raise HTTPException(status_code=409, detail="EWO ini sudah diproses.")

    values = payload.model_dump(exclude_unset=True)
    if "component_id" in values:
        component_id = values["component_id"]
        if component_id is not None:
            component = db.query(Component).filter(Component.id == component_id).first()
            if not component or component.machine_id != ewo.equipment_id:
                raise HTTPException(status_code=404, detail="Component bukan bagian dari equipment EWO")
    if "task_list" in values:
        task_list = values["task_list"]
        if task_list is not None and not task_list.strip():
            raise HTTPException(status_code=422, detail="Task list tidak boleh kosong")

    for key, value in values.items():
        setattr(ewo, key, value.strip() if isinstance(value, str) else value)
    ewo.status = "in_progress"
    ewo.approved_at = datetime.utcnow()
    db.commit()
    db.refresh(ewo)
    return ewo


@router.patch("/{ewo_id}", response_model=EwoRequestResponse)
def update_ewo_request(ewo_id: UUID, payload: EwoRequestUpdate, db: Session = Depends(get_db), _=Depends(require_roles(*READ_ROLES))):
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")
    if ewo.status == "completed":
        raise HTTPException(status_code=409, detail="EWO history bersifat read-only")
    values = payload.model_dump(exclude_unset=True)
    if "equipment_id" in values or "component_id" in values or "section" in values:
        equipment_id = values.get("equipment_id", ewo.equipment_id)
        component_id = values.get("component_id", ewo.component_id)
        section = values.get("section", ewo.section)
        section = section.value if hasattr(section, "value") else section
        component = db.query(Component).filter(Component.id == component_id).first() if component_id else None
        if not component or component.machine_id != equipment_id:
            raise HTTPException(status_code=404, detail="Component is not part of the selected machine")
        if not db.query(Equipment).filter(Equipment.id == equipment_id, Equipment.section == section).first():
            raise HTTPException(status_code=404, detail="Machine not found in selected section")
    for key, value in values.items():
        setattr(ewo, key, value)
    db.commit()
    db.refresh(ewo)
    return ewo


@router.patch("/{ewo_id}/status", response_model=EwoRequestResponse)
def update_ewo_status(
    ewo_id: UUID,
    status: EwoStatus,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*STATUS_ROLES)),
):
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")
    if status != "in_progress" or ewo.status != "pending":
        raise HTTPException(status_code=409, detail="Gunakan alur approval dan Completing EWO untuk transisi status")
    ewo.status = status
    db.commit()
    db.refresh(ewo)
    return ewo


@router.delete("/{ewo_id}", status_code=204)
def delete_ewo_request(ewo_id: UUID, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    ewo = db.query(EwoRequest).filter(EwoRequest.id == ewo_id).first()
    if not ewo:
        raise HTTPException(status_code=404, detail="EWO request not found")
    db.delete(ewo)
    db.commit()
