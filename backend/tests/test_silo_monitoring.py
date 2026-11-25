import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.core.security import OperatorSession, require_roles
from app.models.silo import SiloSensorMapping
from app.routers.silo_monitoring import _source_rows, create_mapping
from app.schemas.silo import SiloMappingCreate
from app.services.silo_monitoring import calculate_capacity_pct, freshness_for


class _EmptyQuery:
    def filter(self, *_args):
        return self

    def first(self):
        return None

    def all(self):
        return []


class _FakeDb:
    def query(self, _model):
        return _EmptyQuery()


class SiloMonitoringTests(unittest.TestCase):
    def test_capacity_is_clamped_and_handles_invalid_scale(self):
        self.assertEqual(calculate_capacity_pct(1500, 1), 100.0)
        self.assertEqual(calculate_capacity_pct(-100, 1), 0.0)
        self.assertIsNone(calculate_capacity_pct(100, 0))
        self.assertIsNone(calculate_capacity_pct(100, None))

    def test_freshness_marks_old_and_missing_data(self):
        now = datetime.now(timezone.utc)
        self.assertEqual(freshness_for(now - timedelta(seconds=1), now), "fresh")
        self.assertEqual(freshness_for(now - timedelta(hours=1), now), "stale")
        self.assertEqual(freshness_for(None, now), "unavailable")

    def test_admin_role_dependency_rejects_non_admin(self):
        dependency = require_roles("super_admin")
        with self.assertRaises(HTTPException) as error:
            dependency(OperatorSession(role="operator"),)
        self.assertEqual(error.exception.status_code, 403)

    def test_mapping_requires_existing_equipment(self):
        payload = SiloMappingCreate(
            device_id="device-1",
            tag="silo-1",
            equipment_ids=[uuid4()],
        )
        with self.assertRaises(HTTPException) as error:
            create_mapping(payload, _FakeDb(), None)
        self.assertEqual(error.exception.status_code, 422)

    def test_unavailable_source_is_explicit_error(self):
        with patch("app.routers.silo_monitoring.read_latest_rows", side_effect=SQLAlchemyError()):
            with self.assertRaises(HTTPException) as error:
                _source_rows()
        self.assertEqual(error.exception.status_code, 503)

    def test_mapping_has_equipment_foreign_key(self):
        foreign_keys = SiloSensorMapping.__table__.c.equipment_id.foreign_keys
        self.assertEqual({str(key.target_fullname) for key in foreign_keys}, {"equipment.id"})


if __name__ == "__main__":
    unittest.main()
