from pydantic import BaseModel


class EquipmentStatusCount(BaseModel):
    operational: int
    warning: int
    critical: int


class FailureBySection(BaseModel):
    section: str
    total: int
    percentage: float
    cumulative_percentage: float


class DashboardSummary(BaseModel):
    # KPI Cards
    mttr_minutes: float | None
    total_failures: int
    open_work_orders: int

    # Equipment status breakdown
    equipment_status: EquipmentStatusCount

    # Chart data
    failure_by_section: list[FailureBySection]
