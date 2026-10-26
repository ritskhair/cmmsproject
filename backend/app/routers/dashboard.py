from datetime import date, datetime, time
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import require_roles
from app.models.equipment import Equipment
from app.models.ewo_maintenance import EwoMaintenance
from app.models.ewo_request import EwoRequest
from app.schemas.dashboard import DashboardSummary, EquipmentStatusCount, FailureBySection

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

READ_ROLES = ("teknisi", "team_leader", "manager", "general_manager", "super_admin")


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    date_from: date = Query(..., description="Start date (inclusive), format: YYYY-MM-DD"),
    date_to: date = Query(..., description="End date (inclusive), format: YYYY-MM-DD"),
    section: Optional[str] = Query(None, description="Filter by section (e.g. '1', '2', ...). Omit for all sections."),
    db: Session = Depends(get_db),
    _=Depends(require_roles(*READ_ROLES)),
):
    # Convert date boundaries to datetime for comparison with DateTime columns
    dt_from = datetime.combine(date_from, time.min)
    dt_to = datetime.combine(date_to, time.max)

    # ── Base EWO query (scoped to period + optional section) ──────────────────
    ewo_q = db.query(EwoRequest).filter(
        EwoRequest.created_at >= dt_from,
        EwoRequest.created_at <= dt_to,
    )
    if section:
        ewo_q = ewo_q.filter(EwoRequest.section == section)

    # ── KPI 1: Total Failures (all EWOs in period) ────────────────────────────
    total_failures: int = ewo_q.count()

    # ── KPI 2: Open Work Orders (status != completed) ────────────────────────
    open_work_orders: int = ewo_q.filter(EwoRequest.status != "completed").count()

    # ── KPI 3: MTTR in minutes (avg repair time of completed maintenance) ─────
    #   Join EwoMaintenance → EwoRequest so section filter applies
    maintenance_q = (
        db.query(
            func.avg(
                func.extract("epoch", EwoMaintenance.end_time - EwoMaintenance.start_time)
            )
        )
        .join(EwoRequest, EwoRequest.id == EwoMaintenance.ewo_request_id)
        .filter(
            EwoMaintenance.end_time >= dt_from,
            EwoMaintenance.end_time <= dt_to,
        )
    )
    if section:
        maintenance_q = maintenance_q.filter(EwoRequest.section == section)

    avg_seconds = maintenance_q.scalar()
    mttr_minutes: float | None = round(avg_seconds / 60, 1) if avg_seconds is not None else None

    # ── KPI 4: Equipment Status Summary ──────────────────────────────────────
    equip_q = db.query(Equipment)
    if section:
        equip_q = equip_q.filter(Equipment.section == section)

    status_counts: dict[str, int] = {
        row.status: row.count
        for row in (
            equip_q.with_entities(Equipment.status, func.count(Equipment.id).label("count"))
            .group_by(Equipment.status)
            .all()
        )
    }
    equipment_status = EquipmentStatusCount(
        operational=status_counts.get("Operational", 0),
        warning=status_counts.get("Warning", 0),
        critical=status_counts.get("Critical", 0),
    )

    # ── KPI 5: Failure Pareto by Section ─────────────────────────────────────
    pareto_q = (
        db.query(EwoRequest.section, func.count(EwoRequest.id).label("total"))
        .filter(
            EwoRequest.created_at >= dt_from,
            EwoRequest.created_at <= dt_to,
            EwoRequest.status == "completed",
        )
        .group_by(EwoRequest.section)
        .order_by(func.count(EwoRequest.id).desc())
    )
    if section:
        pareto_q = pareto_q.filter(EwoRequest.section == section)

    pareto_rows = pareto_q.all()
    pareto_total = sum(row.total for row in pareto_rows)
    cumulative = 0.0
    failure_by_section = []
    for row in pareto_rows:
        percentage = round((row.total / pareto_total) * 100, 1) if pareto_total else 0.0
        cumulative = round(cumulative + percentage, 1)
        failure_by_section.append(
            FailureBySection(
                section=row.section,
                total=row.total,
                percentage=percentage,
                cumulative_percentage=cumulative,
            )
        )

    return DashboardSummary(
        mttr_minutes=mttr_minutes,
        total_failures=total_failures,
        open_work_orders=open_work_orders,
        equipment_status=equipment_status,
        failure_by_section=failure_by_section,
    )
