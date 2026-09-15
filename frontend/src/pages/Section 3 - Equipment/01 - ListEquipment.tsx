import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  equipmentData,
} from "../../datadummy/EquipmentData";

export type EquipmentData = {
  id: string;
  name: string;
  section: string;
  type: string;
  status: "Operational" | "Warning" | "Critical";
  criticality: "A" | "B" | "C";
  lastPM: string;
};


function getStatusClass(status: EquipmentData["status"]) {
  switch (status) {
    case "Operational":
      return "status-operational";
    case "Warning":
      return "status-warning";
    case "Critical":
      return "status-critical";
    default:
      return "";
  }
}

export default function EquipmentList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [areaFilter, setAreaFilter] = useState("All areas");

  const filteredEquipment = useMemo(() => {
    return equipmentData.filter((equipment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        equipment.id.toLowerCase().includes(searchValue) ||
        equipment.name.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All statuses" ||
        equipment.status === statusFilter;

      const matchesArea =
        areaFilter === "All areas" ||
        equipment.section === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [search, statusFilter, areaFilter]);

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Equipment</h1>

        <div className="header-profile">SA</div>
      </header>

      <p className="page-description">
        Asset registry, condition and maintenance readiness
      </p>

      <section className="equipment-filters">
        <div className="filter-group search-filter">
          <label htmlFor="equipment-search">Search equipment</label>

          <input
            id="equipment-search"
            type="text"
            placeholder="Asset ID / name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All statuses</option>
            <option>Operational</option>
            <option>Warning</option>
            <option>Critical</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="area-filter">Area</label>

          <select
            id="area-filter"
            value={areaFilter}
            onChange={(event) => setAreaFilter(event.target.value)}
          >
            <option>All areas</option>
            <option value="1">Section 1</option>
            <option value="2">Section 2</option>
            <option value="3">Section 3</option>
            <option value="4">Section 4</option>
            <option value="5">Section 5</option>
          </select>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => alert("Form Add Equipment belum dibuat.")}
        >
          Add Equipment
        </button>
      </section>

      <section className="equipment-summary">
        <div>
          <span>Total Assets</span>
          <strong>{equipmentData.length}</strong>
        </div>

        <div>
          <span>Operational</span>
          <strong className="text-green">
            {
              equipmentData.filter(
                (equipment) => equipment.status === "Operational"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Warning</span>
          <strong className="text-orange">
            {
              equipmentData.filter(
                (equipment) => equipment.status === "Warning"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Critical</span>
          <strong className="text-red">
            {
              equipmentData.filter(
                (equipment) => equipment.status === "Critical"
              ).length
            }
          </strong>
        </div>
      </section>

      <section className="table-card">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Equipment Name</th>
                <th>Section</th>
                <th>Type</th>
                <th>Status</th>
                <th>Criticality</th>
                <th>Last PM</th>
              </tr>
            </thead>

            <tbody>
              {filteredEquipment.map((equipment) => (
                <tr key={equipment.id}>
                  <td>
                    <Link
                      to={`/equipment/${equipment.id}`}
                      className="equipment-link"
                    >
                      {equipment.id}
                    </Link>
                  </td>

                  <td>
                    <Link
                      to={`/equipment/${equipment.id}`}
                      className="equipment-name-link"
                    >
                      {equipment.name}
                    </Link>
                  </td>

                  <td>{equipment.section}</td>
                  <td>{equipment.type}</td>

                  <td>
                    <span
                      className={`status-text ${getStatusClass(
                        equipment.status
                      )}`}
                    >
                      {equipment.status}
                    </span>
                  </td>

                  <td>{equipment.criticality}</td>
                  <td>{equipment.lastPM}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEquipment.length === 0 && (
          <p className="empty-state">Equipment tidak ditemukan.</p>
        )}
      </section>
    </div>
  );
}