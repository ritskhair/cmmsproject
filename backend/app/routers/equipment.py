from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_account, require_roles
from app.models.component import Component
from app.models.equipment import Equipment
from app.models.section import Section as SectionModel
from app.schemas.equipment import (
    ComponentCreate,
    ComponentResponse,
    ComponentUpdate,
    EquipmentCreate,
    EquipmentResponse,
    EquipmentStatus,
    EquipmentUpdate,
    SectionResponse,
)

router = APIRouter(prefix="/equipment", tags=["equipment"])
MANAGEMENT_ROLES = ("teknisi", "team_leader", "manager", "general_manager", "super_admin")
HIERARCHY_READ_ROLES = (*MANAGEMENT_ROLES, "operator")


@router.get("/sections", response_model=list[SectionResponse])
def list_sections(
    db: Session = Depends(get_db),
    _=Depends(require_roles(*HIERARCHY_READ_ROLES)),
):
    return db.query(SectionModel).filter(SectionModel.active.is_(True)).order_by(SectionModel.code).all()


@router.get("/sections/{section_id}/machines", response_model=list[EquipmentResponse])
def list_section_machines(
    section_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*HIERARCHY_READ_ROLES)),
):
    return db.query(Equipment).filter(Equipment.section_id == section_id).order_by(Equipment.asset_id).all()


@router.get("/machines/{machine_id}/components", response_model=list[ComponentResponse])
def list_machine_components(
    machine_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*HIERARCHY_READ_ROLES)),
):
    if not db.query(Equipment).filter(Equipment.id == machine_id).first():
        raise HTTPException(status_code=404, detail="Machine not found")
    return db.query(Component).filter(Component.machine_id == machine_id).order_by(Component.asset_id).all()


@router.post("/machines/{machine_id}/components", response_model=ComponentResponse, status_code=201)
def create_component(
    machine_id: UUID,
    payload: ComponentCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*MANAGEMENT_ROLES)),
):
    if not db.query(Equipment).filter(Equipment.id == machine_id).first():
        raise HTTPException(status_code=404, detail="Machine not found")
    component = Component(machine_id=machine_id, **payload.model_dump())
    db.add(component)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Component asset ID already exists")
    db.refresh(component)
    return component


@router.patch("/components/{component_id}", response_model=ComponentResponse)
def update_component(
    component_id: UUID,
    payload: ComponentUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(*MANAGEMENT_ROLES)),
):
    component = db.query(Component).filter(Component.id == component_id).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(component, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Component asset ID already exists")
    db.refresh(component)
    return component


@router.delete("/components/{component_id}", status_code=204)
def delete_component(
    component_id: UUID,
    db: Session = Depends(get_db),
    _=Depends(require_roles("super_admin")),
):
    component = db.query(Component).filter(Component.id == component_id).first()
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    db.delete(component)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Component is referenced by a work order")


@router.get("", response_model=list[EquipmentResponse])
def list_equipment(
    status: EquipmentStatus | None = Query(default=None),
    section: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _=Depends(require_roles("teknisi", "team_leader", "manager", "general_manager", "super_admin")),
):
    query = db.query(Equipment)
    if status:
        query = query.filter(Equipment.status == status)
    if section:
        query = query.filter(Equipment.section == section)
    return query.order_by(Equipment.asset_id).all()


@router.post("", response_model=EquipmentResponse, status_code=201)
def create_equipment(payload: EquipmentCreate, db: Session = Depends(get_db), _=Depends(require_roles("teknisi", "team_leader", "manager", "general_manager", "super_admin"))):
    values = payload.model_dump()
    section = db.query(SectionModel).filter(SectionModel.code == payload.section.value).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    equipment = Equipment(**values, section_id=section.id)
    db.add(equipment)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Asset ID already exists")
    db.refresh(equipment)
    return equipment


@router.get("/operator/equipment", response_model=list[EquipmentResponse])
def operator_equipment_options(
    section: str = Query(..., pattern="^[1-5]$"),
    db: Session = Depends(get_db),
    _=Depends(require_roles("operator")),
):
    return db.query(Equipment).filter(Equipment.section == section).order_by(Equipment.asset_id).all()


@router.get("/{equipment_id}", response_model=EquipmentResponse)
def get_equipment(equipment_id: UUID, db: Session = Depends(get_db), _=Depends(require_roles("teknisi", "team_leader", "manager", "general_manager", "super_admin"))):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return equipment


@router.patch("/{equipment_id}", response_model=EquipmentResponse)
def update_equipment(equipment_id: UUID, payload: EquipmentUpdate, db: Session = Depends(get_db), _=Depends(require_roles("teknisi", "team_leader", "manager", "general_manager", "super_admin"))):
    equipment = db.query(Equipment).filter(Equipment.id == equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        if key == "section":
            section = db.query(SectionModel).filter(SectionModel.code == value.value).first()
            if not section:
                raise HTTPException(status_code=404, detail="Section not found")
            equipment.section_id = section.id
        setattr(equipment, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Asset ID already exists")
    db.refresh(equipment)
    return equipment
