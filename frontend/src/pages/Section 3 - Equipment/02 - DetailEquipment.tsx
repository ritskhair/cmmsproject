import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRequest, type Component, type Equipment, type Section } from "../../utils/api";

type HistoryItem = {
  id: string;
  ewo_number: string;
  equipment_id: string;
  code_approval: string;
  start_time: string;
  end_time: string;
  condition_after_repair: string;
  created_at: string;
};

const statuses = ["Operational", "Warning", "Critical"] as const;

export default function EquipmentDetail() {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState("");

  // Component form state — status removed, defaults to "Operational"
  const [componentForm, setComponentForm] = useState({ name: "", type: "" });
  const [componentError, setComponentError] = useState("");
  const [addingComponent, setAddingComponent] = useState(false);

  // Component menu state
  const [activeComponentMenu, setActiveComponentMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableCellElement | null>(null);

  // Equipment edit state
  const [editingEquipment, setEditingEquipment] = useState(false);
  const [equipmentEditForm, setEquipmentEditForm] = useState({
    asset_id: "",
    name: "",
    type: "",
    section: "",
    status: "Operational",
  });
  const [savingEquipment, setSavingEquipment] = useState(false);

  // Component edit state
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [componentEditForm, setComponentEditForm] = useState({
    name: "",
    type: "",
    status: "Operational",
  });
  const [savingComponent, setSavingComponent] = useState(false);

  useEffect(() => {
    void apiRequest<Section[]>("/equipment/sections").then(setSections).catch(() => {});
  }, []);

  useEffect(() => {
    if (!equipmentId) return;
    setError("");
    
    // Load equipment first
    apiRequest<Equipment>(`/equipment/${equipmentId}`)
      .then((equipmentResult) => {
        setEquipment(equipmentResult);
        
        // Load history and components in parallel
        void apiRequest<HistoryItem[]>(`/equipment/${equipmentId}/history`)
          .then(setHistory)
          .catch(() => setHistory([]));

        void apiRequest<Component[]>(`/equipment/machines/${equipmentId}/components`)
          .then(setComponents)
          .catch(() => setComponents([]));
      })
      .catch((requestError) => {
        setError(requestError instanceof Error ? requestError.message : "Detail equipment gagal dimuat.");
      });
  }, [equipmentId]);

  // Close component menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveComponentMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleDeleteEquipment() {
    if (!equipment) return;
    if (!window.confirm(`Hapus equipment ${equipment.name}? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await apiRequest<void>(`/equipment/${equipment.id}`, { method: "DELETE" });
      navigate("/equipment");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Equipment gagal dihapus.");
    }
  }

  async function handleAddComponent() {
    if (!equipmentId) return;
    if (!componentForm.name.trim() || !componentForm.type.trim()) {
      setComponentError("Nama dan tipe komponen wajib diisi.");
      return;
    }
    setAddingComponent(true);
    setComponentError("");
    try {
      await apiRequest<Component>(`/equipment/machines/${equipmentId}/components`, {
        method: "POST",
        body: JSON.stringify({ ...componentForm, status: "Operational" }),
      });
      setComponentForm({ name: "", type: "" });
      const updated = await apiRequest<Component[]>(`/equipment/machines/${equipmentId}/components`);
      setComponents(updated);
    } catch (requestError) {
      setComponentError(requestError instanceof Error ? requestError.message : "Component gagal ditambahkan.");
    } finally {
      setAddingComponent(false);
    }
  }

  async function handleDeleteComponent(component: Component) {
    if (!window.confirm(`Hapus komponen ${component.name}?`)) return;
    setActiveComponentMenu(null);
    try {
      await apiRequest<void>(`/equipment/components/${component.id}`, { method: "DELETE" });
      setComponents((prev) => prev.filter((c) => c.id !== component.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Component gagal dihapus.");
    }
  }

  // Equipment edit handlers
  function startEditEquipment() {
    if (!equipment) return;
    setEquipmentEditForm({
      asset_id: equipment.asset_id,
      name: equipment.name,
      type: equipment.type,
      section: equipment.section,
      status: equipment.status,
    });
    setEditingEquipment(true);
  }

  function cancelEditEquipment() {
    setEditingEquipment(false);
  }

  async function saveEditEquipment() {
    if (!equipment) return;
    setSavingEquipment(true);
    try {
      const updated = await apiRequest<Equipment>(`/equipment/${equipment.id}`, {
        method: "PATCH",
        body: JSON.stringify(equipmentEditForm),
      });
      setEquipment(updated);
      setEditingEquipment(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Equipment gagal diupdate.");
    } finally {
      setSavingEquipment(false);
    }
  }

  // Component edit handlers
  function startEditComponent(comp: Component) {
    setActiveComponentMenu(null);
    setComponentEditForm({
      name: comp.name,
      type: comp.type,
      status: comp.status,
    });
    setEditingComponentId(comp.id);
  }

  function cancelEditComponent() {
    setEditingComponentId(null);
  }

  async function saveEditComponent(compId: string) {
    setSavingComponent(true);
    try {
      const updated = await apiRequest<Component>(`/equipment/components/${compId}`, {
        method: "PATCH",
        body: JSON.stringify(componentEditForm),
      });
      setComponents((prev) => prev.map((c) => (c.id === compId ? updated : c)));
      setEditingComponentId(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Component gagal diupdate.");
    } finally {
      setSavingComponent(false);
    }
  }

  if (error) return (
    <div className="page-container">
      <p className="login-error">{error}</p>
      <Link to="/equipment" className="back-link">Kembali ke Equipment</Link>
    </div>
  );
  if (!equipment) return <div className="page-container"><p>Memuat equipment...</p></div>;

  return (
    <div className="page-container">
      {/* HEADER */}
      <header className="page-header">
        <h1>Equipment Detail</h1>
        <div className="header-profile">SA</div>
      </header>

      {/* EQUIPMENT TITLE STRIP — editable */}
      {editingEquipment ? (
        <section className="equipment-detail-header" style={{ marginTop: "20px" }}>
          <div className="equipment-edit-inline">
            <div className="equipment-edit-grid">
              <div className="compact-field">
                <label htmlFor="edit-eq-asset-id">Asset ID</label>
                <input
                  id="edit-eq-asset-id"
                  value={equipmentEditForm.asset_id}
                  onChange={(e) => setEquipmentEditForm({ ...equipmentEditForm, asset_id: e.target.value })}
                />
              </div>
              <div className="compact-field">
                <label htmlFor="edit-eq-name">Name</label>
                <input
                  id="edit-eq-name"
                  value={equipmentEditForm.name}
                  onChange={(e) => setEquipmentEditForm({ ...equipmentEditForm, name: e.target.value })}
                />
              </div>
              <div className="compact-field">
                <label htmlFor="edit-eq-type">Type</label>
                <input
                  id="edit-eq-type"
                  value={equipmentEditForm.type}
                  onChange={(e) => setEquipmentEditForm({ ...equipmentEditForm, type: e.target.value })}
                />
              </div>
              <div className="compact-field">
                <label htmlFor="edit-eq-section">Section</label>
                <select
                  id="edit-eq-section"
                  value={equipmentEditForm.section}
                  onChange={(e) => setEquipmentEditForm({ ...equipmentEditForm, section: e.target.value })}
                >
                  {sections.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="compact-field">
                <label htmlFor="edit-eq-status">Status</label>
                <select
                  id="edit-eq-status"
                  value={equipmentEditForm.status}
                  onChange={(e) => setEquipmentEditForm({ ...equipmentEditForm, status: e.target.value })}
                >
                  {statuses.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="equipment-edit-actions">
              <button
                type="button"
                className="primary-button compact-btn"
                onClick={() => void saveEditEquipment()}
                disabled={savingEquipment}
              >
                {savingEquipment ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="secondary-button compact-btn"
                onClick={cancelEditEquipment}
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="equipment-detail-header" style={{ marginTop: "20px" }}>
          <div className="equipment-title-area">
            <h2>{equipment.asset_id} | {equipment.name}</h2>
            <span className="status-badge">{equipment.status}</span>
            <span>Section {equipment.section}</span>
            <span>{equipment.type}</span>
          </div>
          <div className="detail-actions">
            <button
              type="button"
              className="primary-button"
              onClick={startEditEquipment}
            >
              ✏️ Edit Equipment
            </button>
            <button
              type="button"
              className="delete-equipment-button"
              onClick={() => void handleDeleteEquipment()}
            >
              🗑 Hapus Equipment
            </button>
          </div>
        </section>
      )}

      {/* INFO GRID - 3 kolom */}
      <section className="information-grid information-grid-3" style={{ marginTop: "16px" }}>
        {/* Asset Information */}
        <div className="information-card">
          <h3>Asset Information</h3>
          <div className="info-compact-list">
            <span className="info-compact-label">Asset ID:</span>
            <span className="info-compact-value">{equipment.asset_id}</span>
            <span className="info-compact-label">Name:</span>
            <span className="info-compact-value">{equipment.name}</span>
            <span className="info-compact-label">Type:</span>
            <span className="info-compact-value">{equipment.type}</span>
            <span className="info-compact-label">Section:</span>
            <span className="info-compact-value">Section {equipment.section}</span>
          </div>
        </div>

        {/* Maintenance Snapshot */}
        <div className="information-card">
          <h3>Maintenance Snapshot</h3>
          <div className="info-compact-list">
            <span className="info-compact-label">Last PM:</span>
            <span className="info-compact-value">{equipment.last_pm ? new Date(equipment.last_pm).toLocaleString() : "-"}</span>
            <span className="info-compact-label">Status:</span>
            <span className="info-compact-value">{equipment.status}</span>
          </div>
        </div>

        {/* Add Component — status removed */}
        <div className="information-card">
          <h3>Add Component</h3>
          <div className="component-form-compact">
            <div className="compact-field">
              <label htmlFor="comp-name">Name</label>
              <input
                id="comp-name"
                placeholder="e.g. Main Motor"
                value={componentForm.name}
                onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })}
              />
            </div>
            <div className="compact-field">
              <label htmlFor="comp-type">Type</label>
              <input
                id="comp-type"
                placeholder="e.g. Motor"
                value={componentForm.type}
                onChange={(e) => setComponentForm({ ...componentForm, type: e.target.value })}
              />
            </div>
            <div className="compact-field">
              <button
                type="button"
                className="primary-button compact-btn"
                onClick={() => void handleAddComponent()}
                disabled={addingComponent}
              >
                {addingComponent ? "..." : "+ Save"}
              </button>
            </div>
            {componentError && <p className="login-error full-width" style={{ margin: "2px 0 0", fontSize: "11px" }}>{componentError}</p>}
          </div>
        </div>
      </section>

      {/* COMPONENT LIST */}
      <section className="history-section" style={{ marginTop: "20px" }}>
        <h2>Component List</h2>
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Asset ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {components.map((comp) =>
                  editingComponentId === comp.id ? (
                    <tr key={comp.id} className="editing-row">
                      <td>
                        <input
                          className="inline-edit-input"
                          value={componentEditForm.name}
                          onChange={(e) => setComponentEditForm({ ...componentEditForm, name: e.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="inline-edit-input"
                          value={componentEditForm.type}
                          onChange={(e) => setComponentEditForm({ ...componentEditForm, type: e.target.value })}
                        />
                      </td>
                      <td>
                        <select
                          className="inline-edit-input"
                          value={componentEditForm.status}
                          onChange={(e) => setComponentEditForm({ ...componentEditForm, status: e.target.value })}
                        >
                          {statuses.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td>{comp.asset_id ?? "-"}</td>
                      <td className="action-cell">
                        <button
                          type="button"
                          className="inline-save-btn"
                          onClick={() => void saveEditComponent(comp.id)}
                          disabled={savingComponent}
                        >
                          {savingComponent ? "..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="inline-cancel-btn"
                          onClick={cancelEditComponent}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={comp.id}>
                      <td><strong>{comp.name}</strong></td>
                      <td>{comp.type}</td>
                      <td>{comp.status}</td>
                      <td>{comp.asset_id ?? "-"}</td>
                      <td className="action-cell" ref={activeComponentMenu === comp.id ? menuRef : null}>
                        <button
                          type="button"
                          className="menu-button"
                          onClick={() => setActiveComponentMenu(activeComponentMenu === comp.id ? null : comp.id)}
                        >⋮</button>
                        {activeComponentMenu === comp.id && (
                          <div className="row-action-menu">
                            <button
                              type="button"
                              onClick={() => startEditComponent(comp)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              style={{ color: "#b22417" }}
                              onClick={() => void handleDeleteComponent(comp)}
                            >
                              🗑 Hapus
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          {components.length === 0 && <p className="empty-state">Belum ada komponen terdaftar.</p>}
        </div>
      </section>

      {/* MAINTENANCE HISTORY */}
      <section className="history-section" style={{ marginTop: "20px" }}>
        <h2>Maintenance History</h2>
        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>EWO</th>
                  <th>Approval</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Condition After Repair</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.ewo_number}</td>
                    <td>{item.code_approval}</td>
                    <td>{new Date(item.start_time).toLocaleString()}</td>
                    <td>{new Date(item.end_time).toLocaleString()}</td>
                    <td>{item.condition_after_repair}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length === 0 && <p className="empty-state">Belum ada histori maintenance.</p>}
        </div>
      </section>

      <Link to="/equipment" className="back-link">Kembali ke List Equipment</Link>
    </div>
  );
}
