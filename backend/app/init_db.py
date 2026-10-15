import time
from pathlib import Path

from sqlalchemy import text

from app.core.database import Base, engine
from app.models import Account, Component, Equipment, EwoMaintenance, EwoRequest, Section


def wait_for_database() -> None:
    for attempt in range(30):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return
        except Exception:
            if attempt == 29:
                raise
            time.sleep(2)


def initialize_database() -> None:
    wait_for_database()
    Base.metadata.create_all(engine)

    migrations_dir = Path(__file__).resolve().parents[1] / "migrations"
    connection = engine.raw_connection()
    try:
        with connection.cursor() as cursor:
            for migration in sorted(migrations_dir.glob("*.sql")):
                cursor.execute(migration.read_text(encoding="utf-8"))
        connection.commit()
    finally:
        connection.close()


if __name__ == "__main__":
    initialize_database()