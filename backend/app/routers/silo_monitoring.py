from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.equipment import Equipment
from app.models.silo import SiloSensorMapping
from app.schemas.silo import (
    SiloAffectedEquipment,
    SiloAvailableSensorResponse,
    SiloMappingCreate,
    SiloMappingResponse,
    SiloMappingUpdate,
    SiloReadingResponse,
    SiloSourceStatusResponse,
)
from app.services.silo_monitoring import (
    calculate_capacity_pct,
    freshness_for,
    read_latest_rows,
    source_error_detail,
)
from app.core.config import SILO_DATABASE_URL

router = APIRouter(prefix="/silo-monitoring", tags=["silo-monitoring"])
READ_ROLES = ("teknisi", "team_leader", "manager", "general_manager", "super_admin")


def _source_rows() -> list[dict]:
    try:
        return read_latest_rows()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=source_error_detail(exc)) from exc


@router.get("/source-status", response_model=SiloSourceStatusResponse)
def source_status(_=Depends(require_roles(*READ_ROLES))):
    if not SILO_DATABASE_URL:
        return SiloSourceStatusResponse(
            configured=False,
            connected=False,
            sensor_count=0,
            message="SILO_DATABASE_URL belum dikonfigurasi pada backend.",
        )
    try:
        rows = read_latest_rows()
    except Exception as exc:
        return SiloSourceStatusResponse(
            configured=True,
            connected=False,
            sensor_count=0,
            message=source_error_detail(exc),
        )
    return SiloSourceStatusResponse(
        configured=True,
        connected=True,
        sensor_count=len(rows),
        message=(
            "Database ExecuSys terhubung, tetapi belum ada sensor terbaru."
            if not rows
            else f"{len(rows)} sensor tersedia dari database ExecuSys."
        ),
    )


@router.get("/readings", response_model=list[SiloReadingResponse])
def list_readings(
    db: Session = Depends(get_db),
    _=Depends(require_roles(*READ_ROLES)),
):
    requested_at = datetime.now(timezone.utc)
    mappings = db.query(SiloSensorMapping).filter(SiloSensorMapping.enabled.is_(True)).all()
    source_by_sensor = {(row["device_id"], row["tag"]): row for row in _source_rows()}
    mappings_by_sensor: dict[tuple[str, str], list[SiloSensorMapping]] = {}
    for mapping in mappings:
        mappings_by_sensor.setdefault((mapping.device_id, mapping.tag), []).append(mapping)

    readings = []
    for (device_id, tag), sensor_mappings in mappings_by_sensor.items():
        mapping = sensor_mappings[0]
        row = source_by_sensor.get((device_id, tag))
        affected_equipment = [
            SiloAffectedEquipment(id=item.equipment.id, name=item.equipment.name, asset_id=item.equipment.asset_id)
            for item in sensor_mappings
            if item.equipment
        ]
        if not row:
            readings.append(SiloReadingResponse(
                device_id=mapping.device_id,
                tag=mapping.tag,
                display_name=mapping.display_name,
                equipment=affected_equipment,
                level_mm=None,
                level_m=None,
                capacity_pct=None,
                sensor_status=None,
                source_created_at=None,
                requested_at=requested_at,
                freshness="unavailable",
                error="Sensor tidak ditemukan pada pembacaan terbaru",
            ))
            continue
        level_mm = row["level_mm"]
        readings.append(SiloReadingResponse(
            device_id=row["device_id"],
            tag=row["tag"],
            display_name=mapping.display_name,
            equipment=affected_equipment,
            level_mm=float(level_mm) if level_mm is not None else None,
            level_m=float(level_mm) / 1000 if level_mm is not None else None,
            capacity_pct=calculate_capacity_pct(level_mm, row["plc_scale_m"]),
            sensor_status=row["status"],
            source_created_at=row["created_at"],
            requested_at=requested_at,
            freshness=freshness_for(row["created_at"], requested_at),
        ))
    return readings


@router.get("/sensors", response_model=list[SiloAvailableSensorResponse])
def list_available_sensors(
    db: Session = Depends(get_db),
    _=Depends(require_roles("super_admin")),
):
    mappings = {
        (mapping.device_id, mapping.tag)
        for mapping in db.query(SiloSensorMapping).all()
    }
    return [
        SiloAvailableSensorResponse(
            device_id=row["device_id"],
            tag=row["tag"],
            sensor_status=row["status"],
            source_created_at=row["created_at"],
            has_mapping=(row["device_id"], row["tag"]) in mappings,
        )
        for row in _source_rows()
    ]


@router.get("/mappings", response_model=list[SiloMappingResponse])
def list_mappings(db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    return db.query(SiloSensorMapping).order_by(SiloSensorMapping.device_id, SiloSensorMapping.tag).all()


@router.post("/mappings", response_model=SiloMappingResponse, status_code=201)
def create_mapping(payload: SiloMappingCreate, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    if len(payload.equipment_ids) != len(set(payload.equipment_ids)):
        raise HTTPException(status_code=422, detail="Equipment tidak boleh dipilih dua kali")
    equipment = db.query(Equipment).filter(Equipment.id.in_(payload.equipment_ids)).all()
    if len(equipment) != len(set(payload.equipment_ids)):
        raise HTTPException(status_code=422, detail="Salah satu equipment tidak ditemukan")
    mappings = [
        SiloSensorMapping(
            device_id=payload.device_id,
            tag=payload.tag,
            equipment_id=equipment_id,
            enabled=payload.enabled,
            display_name=payload.display_name,
        )
        for equipment_id in payload.equipment_ids
    ]
    db.add_all(mappings)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Dependency sensor dan equipment tersebut sudah ada") from exc
    db.refresh(mappings[0])
    return mappings[0]


@router.patch("/mappings/{mapping_id}", response_model=SiloMappingResponse)
def update_mapping(mapping_id: UUID, payload: SiloMappingUpdate, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    mapping = db.query(SiloSensorMapping).filter(SiloSensorMapping.id == mapping_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping tidak ditemukan")
    values = payload.model_dump(exclude_unset=True)
    if "equipment_ids" in values:
        equipment_ids = values.pop("equipment_ids")
        equipment = db.query(Equipment).filter(Equipment.id.in_(equipment_ids)).all()
        if len(equipment) != len(set(equipment_ids)):
            raise HTTPException(status_code=422, detail="Salah satu equipment tidak ditemukan")
        existing = db.query(SiloSensorMapping).filter(
            SiloSensorMapping.device_id == mapping.device_id,
            SiloSensorMapping.tag == mapping.tag,
        ).all()
        existing_by_equipment = {item.equipment_id: item for item in existing}
        requested_ids = set(equipment_ids)
        for item in existing:
            if item.equipment_id not in requested_ids:
                db.delete(item)
        for equipment_id in requested_ids - set(existing_by_equipment):
            db.add(SiloSensorMapping(
                device_id=mapping.device_id,
                tag=mapping.tag,
                equipment_id=equipment_id,
                enabled=values.get("enabled", mapping.enabled),
                display_name=values.get("display_name", mapping.display_name),
            ))
        for item in existing:
            for key, value in values.items():
                setattr(item, key, value)
    for key, value in values.items():
        setattr(mapping, key, value)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Mapping tidak valid") from exc
    refreshed_mapping = db.query(SiloSensorMapping).filter(
        SiloSensorMapping.device_id == mapping.device_id,
        SiloSensorMapping.tag == mapping.tag,
    ).first()
    if not refreshed_mapping:
        raise HTTPException(status_code=409, detail="Dependency tidak memiliki equipment")
    return refreshed_mapping


@router.delete("/mappings/sensor", status_code=204)
def delete_sensor_dependency(
    device_id: str = Query(..., min_length=1),
    tag: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    _=Depends(require_roles("super_admin")),
):
    mappings = db.query(SiloSensorMapping).filter(
        SiloSensorMapping.device_id == device_id,
        SiloSensorMapping.tag == tag,
    ).all()
    if not mappings:
        raise HTTPException(status_code=404, detail="Dependency tidak ditemukan")
    for mapping in mappings:
        db.delete(mapping)
    db.commit()


@router.delete("/mappings/{mapping_id}", status_code=204)
def delete_mapping(mapping_id: UUID, db: Session = Depends(get_db), _=Depends(require_roles("super_admin"))):
    mapping = db.query(SiloSensorMapping).filter(SiloSensorMapping.id == mapping_id).first()
    if not mapping:
        raise HTTPException(status_code=404, detail="Mapping tidak ditemukan")
    db.delete(mapping)
    db.commit()
