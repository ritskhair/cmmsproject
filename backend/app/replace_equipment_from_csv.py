"""Replace CMMS equipment and components from the five-section machine CSV."""

import argparse
import csv
import re
from collections import Counter
from pathlib import Path

from sqlalchemy import delete
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.component import Component
from app.models.equipment import Equipment
from app.models.equipment_task import EquipmentTaskCatalog
from app.models.ewo_maintenance import EwoMaintenance
from app.models.ewo_request import EwoRequest
from app.models.section import Section


CSV_COLUMNS = ((0, 1), (4, 5), (8, 9), (12, 13), (16, 17))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    return parser.parse_args()


def normalize_name(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def read_machines(path: Path) -> dict[str, list[str]]:
    machines: dict[str, list[str]] = {str(section): [] for section in range(1, 6)}
    seen: set[tuple[str, str]] = set()
    with path.open("r", encoding="utf-8-sig", newline="") as source:
        for row in csv.reader(source):
            for section_index, machine_index in CSV_COLUMNS:
                if len(row) <= machine_index:
                    continue
                section = normalize_name(row[section_index]) if len(row) > section_index else ""
                machine = normalize_name(row[machine_index])
                if section not in machines or not machine or machine.lower() == "machine":
                    continue
                key = section, machine.casefold()
                if key not in seen:
                    machines[section].append(machine)
                    seen.add(key)
    return machines


def component_templates(machine_name: str) -> list[tuple[str, str]]:
    name = machine_name.casefold()
    if "conveyor" in name:
        return [("Drive Motor", "Motor"), ("Head/Tail Bearing", "Bearing")]
    if "hammer mill" in name or "chipper" in name:
        return [("Drive Motor", "Motor"), ("Rotor/Bearing Assembly", "Bearing")]
    if "dryer" in name or "cooling" in name:
        return [("Drive Motor", "Motor"), ("Temperature Sensor", "Sensor")]
    if "silo" in name:
        return [("Level Sensor", "Sensor"), ("Discharge Gate", "Actuator")]
    if "sensor" in name:
        return [("Level Sensor", "Sensor")]
    if "fan" in name or "blower" in name:
        return [("Fan Motor", "Motor"), ("Impeller", "Mechanical")]
    if "pelletizer" in name or "packing" in name or "mixer" in name:
        return [("Drive Motor", "Motor"), ("Gearbox", "Gearbox")]
    if "powerpack" in name:
        return [("Hydraulic Pump", "Hydraulic"), ("Pressure Sensor", "Sensor")]
    if "scrubber" in name:
        return [("Circulation Pump", "Pump"), ("Spray Nozzle", "Fluid System")]
    if "airlock" in name:
        return [("Drive Motor", "Motor"), ("Rotary Valve", "Mechanical")]
    if "electromagnet" in name:
        return [("Magnet Coil", "Electrical"), ("Control Sensor", "Sensor")]
    return [("Drive Motor", "Motor"), ("Main Bearing", "Bearing")]


def clear_existing_data(db: Session) -> None:
    db.execute(delete(EwoMaintenance))
    db.execute(delete(EwoRequest))
    db.execute(delete(EquipmentTaskCatalog))
    db.execute(delete(Component))
    db.execute(delete(Equipment))
    db.flush()


def replace_equipment(db: Session, machines: dict[str, list[str]]) -> Counter[str]:
    sections = {
        section.code: section
        for section in db.query(Section).filter(Section.code.in_(machines)).all()
    }
    missing_sections = sorted(set(machines) - set(sections))
    if missing_sections:
        raise RuntimeError(f"Section tidak tersedia di database: {', '.join(missing_sections)}")

    clear_existing_data(db)
    counts: Counter[str] = Counter()
    for section_code, names in machines.items():
        section = sections[section_code]
        for index, machine_name in enumerate(names, start=1):
            equipment = Equipment(
                asset_id=f"CSV-S{section_code}-{index:03d}",
                name=machine_name,
                type="Production Equipment",
                section=section_code,
                section_id=section.id,
                status="Operational",
            )
            db.add(equipment)
            db.flush()
            counts["equipment_created"] += 1
            for component_name, component_type in component_templates(machine_name):
                db.add(Component(
                    name=component_name,
                    type=component_type,
                    machine_id=equipment.id,
                    status="Operational",
                ))
                counts["components_created"] += 1
    db.commit()
    return counts


def main() -> None:
    args = parse_args()
    if not args.csv_path.is_file():
        raise SystemExit(f"CSV tidak ditemukan: {args.csv_path}")
    machines = read_machines(args.csv_path)
    total = sum(len(names) for names in machines.values())
    if total == 0:
        raise SystemExit("Tidak ada machine valid yang ditemukan pada CSV.")
    with SessionLocal() as db:
        counts = replace_equipment(db, machines)
    print(f"Imported {total} unique equipment records.")
    print(f"Created {counts['components_created']} dummy components.")
    print("Existing EWO, equipment, and components were replaced.")


if __name__ == "__main__":
    main()
