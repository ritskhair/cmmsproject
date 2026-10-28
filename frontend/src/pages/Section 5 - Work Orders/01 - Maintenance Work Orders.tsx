/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";

import { apiRequest, type Equipment, type EwoRequest } from "../../utils/api";

type CompletionForm = {
  condition_after_repair: string;
  root_cause: string;
  tools_used: string;
  failure_category: "electrical" | "mechanical" | "";
};

const emptyCompletion: CompletionForm = {
  condition_after_repair: "",
  root_cause: "",
  tools_used: "",
  failure_category: "",
};

export default function WorkOrders() {
  const [ewos, setEwos] = useState<EwoRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selected, setSelected] = useState<EwoRequest | null>(null);
  const [form, setForm] = useState<CompletionForm>(emptyCompletion);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const [ewoResult, equipmentResult] = await Promise.all([
        apiRequest<EwoRequest[]>("/ewo-requests"),
        apiRequest<Equipment[]>("/equipment"),
      ]);
      setEwos(ewoResult);
      setEquipment(equipmentResult);
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Work Orders gagal dimuat.");
    }
  }

  useEffect(() => { void loadData(); }, []);

  const equipmentNames = useMemo(
    () => new Map(equipment.map((item) => [item.id, item.name])),
    [equipment],
  );
  const matchesSearch = (ewo: EwoRequest) => {
    const text = `${ewo.ewo_number} ${ewo.requestor_name} ${equipmentNames.get(ewo.equipment_id) || ""} ${ewo.section}`.toLowerCase();
    return text.includes(search.toLowerCase());
  };
  const open = ewos.filter((ewo) => ewo.status === "pending" && matchesSearch(ewo));
  const completing = ewos.filter((ewo) => ewo.status === "in_progress" && matchesSearch(ewo));
  const history = ewos.filter((ewo) => ewo.status === "completed" && matchesSearch(ewo));

  function selectForCompletion(ewo: EwoRequest) {
    setSelected(ewo);
    setForm(emptyCompletion);
  }

  async function submitCompletion() {
    if (!selected || Object.values(form).some((value) => !value.trim())) {
      setError("Seluruh detail Completing EWO wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(`/ewo-requests/${selected.id}/maintenance`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
        }),
      });
      setSelected(null);
      setForm(emptyCompletion);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Detail maintenance gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  const statusLabel = (status: EwoRequest["status"]) => (
    status === "pending" ? "Open EWO" : status === "in_progress" ? "Completing EWO" : "History EWO"
  );
  const renderRow = (ewo: EwoRequest, action = false) => (
    <tr key={ewo.id}>
      <td><strong>{ewo.ewo_number}</strong></td>
      <td>{ewo.requestor_name}</td>
      <td>{equipmentNames.get(ewo.equipment_id) || ewo.equipment_id}</td>
      <td>{ewo.section}</td>
      <td>{new Date(ewo.created_at).toLocaleString()}</td>
      <td><span className={`status-badge status-${ewo.status === "completed" ? "done" : "pending"}`}>{statusLabel(ewo.status)}</span></td>
      {action && <td><button type="button" className="status-select" onClick={() => selectForCompletion(ewo)}>Isi Detail</button></td>}
    </tr>
  );

  return (
    <div className="work-orders-page work-orders-background">
      <header className="page-header">
        <div><h1>Work Orders</h1><p>Open, Completing, dan History Emergency Work Order</p></div>
        <div className="profile-initial">MT</div>
      </header>
      {error && <p className="login-error">{error}</p>}
      <section className="ewo-kpi-grid">
        <div className="ewo-kpi-card"><span>Open EWO</span><strong>{open.length}</strong></div>
        <div className="ewo-kpi-card"><span>Completing EWO</span><strong>{completing.length}</strong></div>
        <div className="ewo-kpi-card"><span>History EWO</span><strong>{history.length}</strong></div>
        <div className="ewo-kpi-card"><span>Total</span><strong>{ewos.length}</strong></div>
      </section>
      <div className="ewo-toolbar"><input placeholder="Search EWO code, equipment, requestor..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>

      <section className="ewo-section">
        <div className="section-title"><h2>Open EWO</h2><p>EWO yang menunggu approval Production.</p></div>
        <div className="ewo-table-wrapper"><table className="ewo-table"><thead><tr><th>EWO Code</th><th>Requestor</th><th>Equipment</th><th>Section</th><th>Created</th><th>Status</th></tr></thead><tbody>{open.length ? open.map((ewo) => renderRow(ewo)) : <tr><td colSpan={6} className="empty-row">Tidak ada Open EWO.</td></tr>}</tbody></table></div>
      </section>

      <section className="ewo-section">
        <div className="section-title"><h2>Completing EWO</h2><p>Maintenance mengisi detail penyelesaian sebelum masuk History.</p></div>
        <div className="ewo-table-wrapper"><table className="ewo-table"><thead><tr><th>EWO Code</th><th>Requestor</th><th>Equipment</th><th>Section</th><th>Created</th><th>Status</th><th>Action</th></tr></thead><tbody>{completing.length ? completing.map((ewo) => renderRow(ewo, true)) : <tr><td colSpan={7} className="empty-row">Tidak ada Completing EWO.</td></tr>}</tbody></table></div>
      </section>

      <section className="ewo-section">
        <div className="section-title"><h2>History EWO</h2><p>EWO completed dan tidak dapat diubah lagi.</p></div>
        <div className="history-list">{history.length ? history.map((ewo) => <div className="history-item" key={ewo.id}><div><strong>{ewo.ewo_number}</strong><p>{equipmentNames.get(ewo.equipment_id) || ewo.equipment_id} — {ewo.requestor_name}</p><small>Section {ewo.section} · {new Date(ewo.created_at).toLocaleString()}</small></div><span className="status-badge status-done">History EWO</span></div>) : <p className="empty-history">Tidak ada History EWO.</p>}</div>
      </section>

      {selected && <div className="ewo-modal-backdrop"><section className="ewo-completion-modal"><h2>Completing {selected.ewo_number}</h2><p>{equipmentNames.get(selected.equipment_id) || selected.equipment_id}</p><div className="operator-detail-grid">
        <label>Failure Category<select value={form.failure_category} onChange={(event) => setForm({ ...form, failure_category: event.target.value as CompletionForm["failure_category"] })}><option value="">Pilih kategori</option><option value="electrical">Electrical</option><option value="mechanical">Mechanical</option></select></label>
      </div>
      <label>Root Cause<textarea rows={4} value={form.root_cause} onChange={(event) => setForm({ ...form, root_cause: event.target.value })} /></label>
      <label>Tools Used<textarea rows={4} value={form.tools_used} onChange={(event) => setForm({ ...form, tools_used: event.target.value })} /></label>
      <label>Condition After Repair<textarea rows={3} value={form.condition_after_repair} onChange={(event) => setForm({ ...form, condition_after_repair: event.target.value })} /></label>
      <div className="operator-choice-actions"><button type="button" className="operator-choice-button operator-choice-secondary" onClick={() => setSelected(null)}>Cancel</button><button type="button" className="operator-choice-button operator-choice-primary" disabled={saving} onClick={() => void submitCompletion()}>{saving ? "Menyimpan..." : "Simpan ke History"}</button></div>
      </section></div>}
    </div>
  );
}
