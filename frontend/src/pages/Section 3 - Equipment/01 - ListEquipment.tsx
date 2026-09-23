import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest, type Component, type Equipment, type Section } from "../../utils/api";

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
  const [sections, setSections] = useState<Section[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Equipment | null>(null);
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
  const [componentForm, setComponentForm] = useState({ name: "", type: "", status: "Operational" });

  useEffect(() => {
    void apiRequest<Section[]>("/equipment/sections").then(setSections).catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Section gagal dimuat."));
  }, []);

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

  async function selectMachine(machine: Equipment) {
    setSelectedMachine(machine);
    try {
      setComponents(await apiRequest<Component[]>(`/equipment/machines/${machine.id}/components`));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Component gagal dimuat.");
    }
  }

  async function addComponent() {
    if (!selectedMachine) return;
    try {
      await apiRequest<Component>(`/equipment/machines/${selectedMachine.id}/components`, { method: "POST", body: JSON.stringify(componentForm) });
      setComponentForm({ name: "", type: "", status: "Operational" });
      await selectMachine(selectedMachine);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Component gagal dibuat.");
    }
  }

  return (
    <div className="page-container">
      <header className="page-header"><h1>Equipment</h1><div className="header-profile">SA</div></header>
      <p className="page-description">Asset registry, condition and maintenance readiness</p>
      <section className="equipment-filters">
        <div className="filter-group search-filter"><label htmlFor="equipment-search">Search equipment</label><input id="equipment-search" placeholder="Asset ID / name" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <div className="filter-group"><label htmlFor="status-filter">Status</label><select id="status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="filter-group"><label htmlFor="area-filter">Section</label><select id="area-filter" value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="">All sections</option>{sections.map((section) => <option key={section.code} value={section.code}>{section.name}</option>)}</select></div>
        <button type="button" className="primary-button" onClick={() => setShowForm((value) => !value)}>Add Equipment</button>
      </section>
      {showForm && <section className="equipment-form-card"><div className="equipment-form-header"><div><h2>Add Equipment</h2><p>Register a machine under a section.</p></div><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button></div><div className="equipment-form-grid"><div className="filter-group"><label htmlFor="add-equipment-asset-id">Asset ID</label><input id="add-equipment-asset-id" placeholder="e.g. MCH-001" value={form.asset_id} onChange={(event) => setForm({ ...form, asset_id: event.target.value })} /></div><div className="filter-group"><label htmlFor="add-equipment-name">Machine name</label><input id="add-equipment-name" placeholder="e.g. Pellet Mill 01" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div><div className="filter-group"><label htmlFor="add-equipment-type">Machine type</label><input id="add-equipment-type" placeholder="e.g. Motor" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /></div><div className="filter-group"><label htmlFor="add-equipment-section">Section</label><select id="add-equipment-section" value={form.section} onChange={(event) => setForm({ ...form, section: event.target.value })}>{sections.map((section) => <option key={section.code} value={section.code}>{section.name}</option>)}</select></div><div className="filter-group"><label htmlFor="add-equipment-status">Status</label><select id="add-equipment-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div><div className="equipment-form-actions"><button type="button" className="primary-button" onClick={() => void addEquipment()}>Save Equipment</button></div></section>}
      {error && <p className="login-error">{error}</p>}
      <section className="equipment-summary"><div><span>Total Assets</span><strong>{equipment.length}</strong></div><div><span>Operational</span><strong className="text-green">{equipment.filter((item) => item.status === "Operational").length}</strong></div><div><span>Warning</span><strong className="text-orange">{equipment.filter((item) => item.status === "Warning").length}</strong></div><div><span>Critical</span><strong className="text-red">{equipment.filter((item) => item.status === "Critical").length}</strong></div></section>
      <section className="equipment-hierarchy"><div className="table-card"><div className="table-scroll"><table><thead><tr><th>Asset ID</th><th>Machine</th><th>Section</th><th>Type</th><th>Status</th><th>Last PM</th></tr></thead><tbody>{filteredEquipment.map((item) => <tr key={item.id} className={selectedMachine?.id === item.id ? "selected-row" : ""} onClick={() => void selectMachine(item)}><td><Link to={`/equipment/${item.id}`} className="equipment-link" onClick={(event) => event.stopPropagation()}>{item.asset_id}</Link></td><td><Link to={`/equipment/${item.id}`} className="equipment-name-link" onClick={(event) => event.stopPropagation()}>{item.name}</Link></td><td>{item.section}</td><td>{item.type}</td><td><span className={`status-text ${getStatusClass(item.status)}`}>{item.status}</span></td><td>{item.last_pm ? new Date(item.last_pm).toLocaleString() : "-"}</td></tr>)}</tbody></table></div>{filteredEquipment.length === 0 && <p className="empty-state">Equipment tidak ditemukan.</p>}</div>
        <aside className="component-panel"><h2>{selectedMachine ? selectedMachine.name : "Pilih Machine"}</h2>{selectedMachine ? <><p>{selectedMachine.section} / {selectedMachine.asset_id}</p><div className="component-form"><label htmlFor="component-name">Component name</label><input id="component-name" placeholder="e.g. Main Motor" value={componentForm.name} onChange={(event) => setComponentForm({ ...componentForm, name: event.target.value })} /><label htmlFor="component-type">Type</label><input id="component-type" placeholder="e.g. Motor" value={componentForm.type} onChange={(event) => setComponentForm({ ...componentForm, type: event.target.value })} /><label htmlFor="component-status">Status</label><select id="component-status" value={componentForm.status} onChange={(event) => setComponentForm({ ...componentForm, status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><button type="button" className="primary-button" onClick={() => void addComponent()}>Add Component</button></div><ul className="component-list">{components.map((component) => <li key={component.id}><strong>{component.name}</strong><span>{component.type}</span></li>)}{components.length === 0 && <li>No components yet.</li>}</ul></> : <p>Select a machine to add or view components.</p>}</aside>
      </section>
    </div>
  );
}
