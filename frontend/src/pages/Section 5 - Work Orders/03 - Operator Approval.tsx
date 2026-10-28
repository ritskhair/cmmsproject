/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { apiRequest, type Component, type EwoRequest, type Equipment } from "../../utils/api";

export default function OperatorApproval() {
  const [ewos, setEwos] = useState<EwoRequest[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selected, setSelected] = useState<EwoRequest | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [taskList, setTaskList] = useState("");
  const [componentId, setComponentId] = useState("");
  const [componentDescription, setComponentDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    try {
      const [open, ...machineGroups] = await Promise.all([
        apiRequest<EwoRequest[]>("/ewo-requests/operator/open"),
        ...(["1", "2", "3", "4", "5"] as const).map((section) =>
          apiRequest<Equipment[]>(`/equipment/operator/equipment?section=${section}`),
        ),
      ]);
      const machines = machineGroups.flat();
      setEwos(open);
      setEquipment(machines);
      if (selected) {
        const refreshed = open.find((item) => item.id === selected.id);
        setSelected(refreshed ?? null);
      }
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "EWO approval gagal dimuat.");
    }
  }

  useEffect(() => { void loadData(); }, []);

  async function selectEwo(ewo: EwoRequest) {
    setSelected(ewo);
    setTaskList(ewo.task_list ?? "");
    setComponentId(ewo.component_id ?? "");
    setComponentDescription(ewo.component_other_description ?? "");
    try {
      setComponents(await apiRequest<Component[]>(`/equipment/machines/${ewo.equipment_id}/components`));
      setError("");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Component gagal dimuat.");
    }
  }

  async function approve() {
    if (!selected || !taskList.trim()) {
      setError("Task list wajib diisi sebelum approval.");
      return;
    }
    setSaving(true);
    try {
      await apiRequest(`/ewo-requests/${selected.id}/approve`, {
        method: "PATCH",
        body: JSON.stringify({
          task_list: taskList.trim(),
          component_id: componentId && componentId !== "__other__" ? componentId : null,
          component_other_description: componentDescription.trim() || null,
        }),
      });
      setSelected(null);
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Approval EWO gagal.");
    } finally {
      setSaving(false);
    }
  }

  const equipmentNames = new Map(equipment.map((item) => [item.id, item.name]));

  return (
    <section className="operator-approval-page work-orders-background">
      <div className="operator-page-heading">
        <div>
          <p className="operator-eyebrow">Production Approval</p>
          <h1>Approve EWO</h1>
          <p>Periksa dan lengkapi keterangan sebelum EWO masuk ke Maintenance.</p>
        </div>
      </div>
      {error && <p className="login-error">{error}</p>}
      <div className="operator-approval-grid">
        <div className="operator-approval-list">
          <h2>Open EWO</h2>
          {ewos.length === 0 && <p className="empty-history">Tidak ada EWO yang menunggu approval.</p>}
          {ewos.map((ewo) => (
            <button type="button" className={`operator-approval-item${selected?.id === ewo.id ? " active" : ""}`} key={ewo.id} onClick={() => void selectEwo(ewo)}>
              <strong>{ewo.ewo_number}</strong>
              <span>{equipmentNames.get(ewo.equipment_id) ?? ewo.equipment_id}</span>
              <small>Section {ewo.section} · {ewo.requestor_name}</small>
            </button>
          ))}
        </div>
        {selected ? (
          <div className="operator-approval-detail">
            <h2>{selected.ewo_number}</h2>
            <p className="operator-detail-muted">
              {equipmentNames.get(selected.equipment_id) ?? selected.equipment_id} · Section {selected.section}
            </p>
            <div className="operator-detail-grid">
              <label>Requestor<input value={selected.requestor_name} readOnly /></label>
              <label>Department<input value={selected.department} readOnly /></label>
              <label>Shift<input value={selected.shift} readOnly /></label>
              <label>Team Leader<input value={selected.team_leader_name} readOnly /></label>
            </div>
            <label>Task List / Keterangan Kerusakan<textarea value={taskList} onChange={(event) => setTaskList(event.target.value)} rows={4} /></label>
            <label>Component<select value={componentId} onChange={(event) => setComponentId(event.target.value)}>
              <option value="">Pilih component</option>
              {components.map((component) => <option value={component.id} key={component.id}>{component.name}</option>)}
              <option value="__other__">Others</option>
            </select></label>
            {componentId === "__other__" && <label>Keterangan Component<textarea value={componentDescription} onChange={(event) => setComponentDescription(event.target.value)} rows={3} /></label>}
            <button type="button" className="operator-choice-button operator-choice-primary" disabled={saving} onClick={() => void approve()}>
              {saving ? "Memproses..." : "Approve & Kirim ke Completing EWO"}
            </button>
          </div>
        ) : <div className="operator-approval-detail operator-approval-empty"><p>Pilih EWO untuk melihat detail.</p></div>}
      </div>
    </section>
  );
}
