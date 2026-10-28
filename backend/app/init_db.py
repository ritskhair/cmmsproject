import time
from pathlib import Path

from sqlalchemy import text

from app.core.config import INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_USERNAME
from app.core.database import Base, engine
from app.core.security import hash_password
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

    create_initial_admin()


def create_initial_admin() -> None:
    if not INITIAL_ADMIN_USERNAME and not INITIAL_ADMIN_PASSWORD:
        return

    if len(INITIAL_ADMIN_PASSWORD) < 8:
        raise RuntimeError("INITIAL_ADMIN_PASSWORD harus memiliki minimal 8 karakter.")

    from app.core.database import SessionLocal

    db = SessionLocal()
    try:
        if db.query(Account).filter(Account.role == "super_admin").first():
            return

        if db.query(Account).filter(Account.username == INITIAL_ADMIN_USERNAME).first():
            raise RuntimeError(
                f"Username awal '{INITIAL_ADMIN_USERNAME}' sudah digunakan oleh akun non-admin."
            )

        db.add(
            Account(
                username=INITIAL_ADMIN_USERNAME,
                password=hash_password(INITIAL_ADMIN_PASSWORD),
                role="super_admin",
            )
        )
        db.commit()
        print(f"Initial super admin '{INITIAL_ADMIN_USERNAME}' created.")
    finally:
        db.close()


if __name__ == "__main__":
    initialize_database()