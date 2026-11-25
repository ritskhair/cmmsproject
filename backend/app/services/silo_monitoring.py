from datetime import datetime, timezone
from decimal import Decimal
from threading import Lock
from time import monotonic

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import (
    SILO_CONNECTION_TIMEOUT_SECONDS,
    SILO_DATABASE_URL,
    SILO_DATA_TIMEOUT_SECONDS,
    SILO_MAX_OVERFLOW,
    SILO_POOL_SIZE,
)

_engine: Engine | None = None
_engine_lock = Lock()
_cache_lock = Lock()
_cache_expires_at = 0.0
_cache_rows: list[dict] | None = None


def get_silo_engine() -> Engine:
    global _engine
    if not SILO_DATABASE_URL:
        raise RuntimeError("SILO_DATABASE_URL belum dikonfigurasi")
    with _engine_lock:
        if _engine is None:
            _engine = create_engine(
                SILO_DATABASE_URL,
                pool_size=SILO_POOL_SIZE,
                max_overflow=SILO_MAX_OVERFLOW,
                pool_pre_ping=True,
                connect_args={
                    "connect_timeout": SILO_CONNECTION_TIMEOUT_SECONDS,
                    "options": "-c default_transaction_read_only=on",
                },
            )
    return _engine


def calculate_capacity_pct(level_mm: Decimal | float | None, plc_scale_m: Decimal | float | None) -> float | None:
    if level_mm is None or plc_scale_m is None or plc_scale_m == 0:
        return None
    value = float(level_mm) / (float(plc_scale_m) * 1000) * 100
    return max(0.0, min(100.0, value))


def freshness_for(created_at: datetime | None, now: datetime | None = None) -> str:
    if created_at is None:
        return "unavailable"
    current = now or datetime.now(timezone.utc)
    source_time = created_at if created_at.tzinfo else created_at.replace(tzinfo=timezone.utc)
    age = (current - source_time).total_seconds()
    return "fresh" if age <= SILO_DATA_TIMEOUT_SECONDS else "stale"


def _read_latest_rows() -> list[dict]:
    query = text(
        """
        WITH latest_data AS (
            SELECT DISTINCT ON (device_id, tag)
                device_id, tag, level_mm, plc_scale_m, status, created_at
            FROM sensor_data
            ORDER BY device_id, tag, created_at DESC
        ),
        latest_config AS (
            SELECT DISTINCT ON (device_id, tag)
                device_id, tag, max_height_m, max_volume_m3, max_mass_t, updated_at
            FROM sensor_config
            ORDER BY device_id, tag, updated_at DESC
        )
        SELECT
            data.device_id, data.tag, data.level_mm, data.plc_scale_m,
            data.status, data.created_at,
            config.max_height_m, config.max_volume_m3, config.max_mass_t
        FROM latest_data AS data
        LEFT JOIN latest_config AS config
          ON config.device_id = data.device_id AND config.tag = data.tag
        ORDER BY data.device_id, data.tag
        """
    )
    with get_silo_engine().connect() as connection:
        return [dict(row) for row in connection.execute(query).mappings().all()]


def read_latest_rows() -> list[dict]:
    global _cache_expires_at, _cache_rows
    now = monotonic()
    with _cache_lock:
        if _cache_rows is not None and now < _cache_expires_at:
            return _cache_rows
    rows = _read_latest_rows()
    with _cache_lock:
        _cache_rows = rows
        _cache_expires_at = monotonic() + 5
    return rows


def clear_cache() -> None:
    global _cache_expires_at, _cache_rows
    with _cache_lock:
        _cache_rows = None
        _cache_expires_at = 0


def source_error_detail(exc: Exception) -> str:
    if isinstance(exc, RuntimeError):
        return str(exc)
    if isinstance(exc, SQLAlchemyError):
        return "Database ExecuSys tidak tersedia atau query pembacaan gagal"
    return "Pembacaan database ExecuSys gagal"
