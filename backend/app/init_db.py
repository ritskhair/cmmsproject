import time
from pathlib import Path

from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import ProgrammingError

from app.core.config import (
    DATABASE_URL,
    DB_BOOTSTRAP_ADMIN_DATABASE,
    INITIAL_ADMIN_PASSWORD,
    INITIAL_ADMIN_USERNAME,
)
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


def create_database_if_missing() -> None:
    target_url = make_url(DATABASE_URL)
    database_name = target_url.database
    if not database_name:
        raise RuntimeError("DATABASE_URL harus menyertakan nama database target.")
    if not database_name.replace("_", "").isalnum():
        raise RuntimeError(
            "Nama database hanya boleh berisi huruf, angka, dan underscore."
        )

    admin_url = target_url.set(database=DB_BOOTSTRAP_ADMIN_DATABASE)
    admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
    try:
        for attempt in range(30):
            try:
                with admin_engine.connect() as connection:
                    exists = connection.execute(
                        text("SELECT 1 FROM pg_database WHERE datname = :database_name"),
                        {"database_name": database_name},
                    ).scalar()
                    if exists:
                        return

                    escaped_name = database_name.replace('"', '""')
                    try:
                        connection.exec_driver_sql(f'CREATE DATABASE "{escaped_name}"')
                    except ProgrammingError:
                        connection.rollback()
                        exists = connection.execute(
                            text("SELECT 1 FROM pg_database WHERE datname = :database_name"),
                            {"database_name": database_name},
                        ).scalar()
                        if not exists:
                            raise
                    return
            except Exception:
                if attempt == 29:
                    raise
                time.sleep(2)
    finally:
        admin_engine.dispose()


def initialize_database() -> None:
    create_database_if_missing()
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