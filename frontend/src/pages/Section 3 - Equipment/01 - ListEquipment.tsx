import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest, type Equipment } from "../../utils/api";

const sections = ["1", "2", "3", "4", "5"] as const;
const statuses = ["Operational", "Warning", "Critical"] as const;

type EquipmentForm = {
  asset_id: string;
  name: string;
  type: string;
  section: string;
  status: string;
};

function getStatusClass(status: Equipment["status"]) {
  return `status-${status.toLowerCase()}`;
}

export default function EquipmentList() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EquipmentForm>({
    asset_id: "",
    name: "",
    type: "",
    section: "1",
    status: "Operational",
  });

  async function loadEquipment() {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (sectionFilter) params.set("section", sectionFilter);
      setEquipment(await apiRequest<Equipment[]>(`/equipment?${params}`));
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Equipment gagal dimuat.");
    }
  }

  useEffect(() => {
    void loadEquipment();
  }, [statusFilter, sectionFilter]);

  const filteredEquipment = useMemo(() => {
    const value = search.toLowerCase();
    return equipment.filter((item) => `${item.asset_id} ${item.name} ${item.type}`.toLowerCase().includes(value));
  }, [equipment, search]);

  async function addEquipment() {
    try {
      await apiRequest<Equipment>("/equipment", { method: "POST", body: JSON.stringify(form) });
      setForm({ asset_id: "", name: "", type: "", section: "1", status: "Operational" });
      setShowForm(false);
      await loadEquipment();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Equipment gagal dibuat.");
    }
  }

  return (
    <div className="page-container">
      <header className="page-header"><h1>Equipment</h1><div className="header-profile">SA</div></header>
      <p className="page-description">Asset registry, condition and maintenance readiness</p>
      <section className="equipment-filters">
        <div className="filter-group search-filter"><label htmlFor="equipment-search">Search equipment</label><input id="equipment-search" placeholder="Asset ID / name" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="filter-group"><label htmlFor="status-filter">Status</label><select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="filter-group"><label htmlFor="area-filter">Section</label><select id="area-filter" value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="">All sections</option>{sections.map((section) => <option key={section} value={section}>Section {section}</option>)}</select></div>
        <button type="button" className="primary-button" onClick={() => setShowForm((value) => !value)}>Add Equipment</button>
      </section>
      {showForm && <section className="table-card" style={{ padding: 20 }}><h2>Add Equipment</h2><div className="equipment-filters"><input placeholder="Asset ID" value={form.asset_id} onChange={(event) => setForm({ ...form, asset_id: event.target.value })} /><input placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><input placeholder="Type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /><select value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })}>{sections.map((section) => <option key={section} value={section}>Section {section}</option>)}</select><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button type="button" className="primary-button" onClick={() => void addEquipment()}>Save</button></div></section>}
      {error && <p className="login-error">{error}</p>}
      <section className="equipment-summary"><div><span>Total Assets</span><strong>{equipment.length}</strong></div><div><span>Operational</span><strong className="text-green">{equipment.filter((item) => item.status === "Operational").length}</strong></div><div><span>Warning</span><strong className="text-orange">{equipment.filter((item) => item.status === "Warning").length}</strong></div><div><span>Critical</span><strong className="text-red">{equipment.filter((item) => item.status === "Critical").length}</strong></div></section>
      <section className="table-card"><div className="table-scroll"><table><thead><tr><th>Asset ID</th><th>Equipment Name</th><th>Section</th><th>Type</th><th>Status</th><th>Last PM</th></tr></thead><tbody>{filteredEquipment.map((item) => <tr key={item.id}><td><Link to={`/equipment/${item.id}`} className="equipment-link">{item.asset_id}</Link></td><td><Link to={`/equipment/${item.id}`} className="equipment-name-link">{item.name}</Link></td><td>{item.section}</td><td>{item.type}</td><td><span className={`status-text ${getStatusClass(item.status)}`}>{item.status}</span></td><td>{item.last_pm ? new Date(item.last_pm).toLocaleString() : "-"}</td></tr>)}</tbody></table></div>{filteredEquipment.length === 0 && <p className="empty-state">Equipment tidak ditemukan.</p>}</section>
    </div>
  );
}
