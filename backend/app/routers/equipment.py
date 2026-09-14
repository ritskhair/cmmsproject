from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_account
from app.models.equipment import Equipment
from app.schemas.equipment import EquipmentCreate, EquipmentResponse, EquipmentStatus, EquipmentUpdate

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("", response_model=list[EquipmentResponse])
def list_equipment(
    status: EquipmentStatus | None = Query(default=None),
    section: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _=Depends(get_current_account),
):
    query = db.query(Equipment)
    if status:
        query = query.filter(Equipment.status == status)
    if section:
        query = query.filter(Equipment.section == section)
    return query.order_by(Equipment.asset_id).all()


@router.post("", response_model=EquipmentResponse, status_code=201)
def create_equipment(payload: EquipmentCreate, db: Session = Depends(get_db), _=Depends(get_current_account)):
    equipment = Equipment(**payload.model_dump())
    db.add(equipment)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Asset ID already exists")
    db.refresh(equipment)
    return equipment


@router.get("/{equipment_id}", response_model=EquipmentResponse)
def get_equipment(equipment_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_account)):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@router.patch("/{equipment_id}", response_model=EquipmentResponse)
def update_equipment(equipment_id: UUID, payload: EquipmentUpdate, db: Session = Depends(get_db), _=Depends(get_current_account)):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(equipment, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Asset ID already exists")
    db.refresh(equipment)
    return equipment
