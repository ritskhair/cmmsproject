import { useEffect, useMemo, useState } from "react";

import { apiRequest, type Equipment } from "../../utils/api";

type Ewo = {
  id: string;
  ewo_number: string;
  requestor_name: string;
  department: string;
  equipment_id: string;
  section: "1" | "2" | "3" | "4" | "5";
  shift: string;
  team_leader_name: string;
  failure_type: "total" | "partial";
  task_list: string;
  special_note: string | null;
  status: "pending" | "in_progress" | "completed";
  created_at: string;
};

const statusLabels = { pending: "Pending", in_progress: "On Progress", completed: "Done" };

export default function WorkOrders() {
  const [ewos, setEwos] = useState<Ewo[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [ewoResult, equipmentResult] = await Promise.all([
        apiRequest<Ewo[]>("/ewo-requests"),
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

  const equipmentNames = new Map(equipment.map((item) => [item.id, item.name]));
  const visibleEwos = useMemo(() => ewos.filter((ewo) => {
    const text = `${ewo.ewo_number} ${ewo.requestor_name} ${equipmentNames.get(ewo.equipment_id) || ""} ${ewo.section}`.toLowerCase();
    return text.includes(search.toLowerCase()) && (!statusFilter || ewo.status === statusFilter);
  }), [ewos, equipment, search, statusFilter]);

  async function updateStatus(ewoId: string, status: Ewo["status"]) {
    try {
      await apiRequest(`/ewo-requests/${ewoId}/status?status=${status}`, { method: "PATCH" });
      await loadData();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Status EWO gagal diperbarui.");
    }
  }

  const current = visibleEwos.filter((ewo) => ewo.status !== "completed");
  const history = visibleEwos.filter((ewo) => ewo.status === "completed");

  const renderRow = (ewo: Ewo) => <tr key={ewo.id}><td><strong>{ewo.ewo_number}</strong></td><td>{ewo.requestor_name}</td><td>{equipmentNames.get(ewo.equipment_id) || ewo.equipment_id}</td><td>{ewo.section}</td><td>{new Date(ewo.created_at).toLocaleString()}</td><td><select className="status-select" value={ewo.status} onChange={(event) => void updateStatus(ewo.id, event.target.value as Ewo["status"])}><option value="pending">Pending</option><option value="in_progress">On Progress</option><option value="completed">Done</option></select></td></tr>;

  return <div className="work-orders-page"><header className="page-header"><div><h1>Work Orders</h1><p>Monitoring Emergency Work Order</p></div><div className="profile-initial">SA</div></header>{error && <p className="login-error">{error}</p>}<section className="ewo-kpi-grid"><div className="ewo-kpi-card"><span>Total Work Orders</span><strong>{ewos.length}</strong></div><div className="ewo-kpi-card"><span>Pending</span><strong>{ewos.filter((item) => item.status === "pending").length}</strong></div><div className="ewo-kpi-card"><span>On Progress</span><strong>{ewos.filter((item) => item.status === "in_progress").length}</strong></div><div className="ewo-kpi-card"><span>Done</span><strong>{ewos.filter((item) => item.status === "completed").length}</strong></div></section><section className="ewo-section"><div className="section-title"><h2>EWO Saat Ini</h2><p>Daftar EWO yang masih dalam proses penanganan</p></div><div className="ewo-toolbar"><input placeholder="Search EWO code, equipment, requestor..." value={search} onChange={(event) => setSearch(event.target.value)} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Status</option><option value="pending">Pending</option><option value="in_progress">On Progress</option><option value="completed">Done</option></select></div><div className="ewo-table-wrapper"><table className="ewo-table"><thead><tr><th>EWO Code</th><th>Requestor</th><th>Equipment</th><th>Section</th><th>Created</th><th>Status</th></tr></thead><tbody>{current.length ? current.map(renderRow) : <tr><td colSpan={6} className="empty-row">Tidak ada EWO aktif.</td></tr>}</tbody></table></div></section><section className="ewo-section"><div className="section-title"><h2>History EWO</h2><p>Daftar EWO yang telah selesai ditangani</p></div><div className="history-list">{history.length ? history.map((ewo) => <div className="history-item" key={ewo.id}><div><strong>{ewo.ewo_number}</strong><p>{equipmentNames.get(ewo.equipment_id) || ewo.equipment_id} — {ewo.requestor_name}</p><small>Section {ewo.section} · {new Date(ewo.created_at).toLocaleString()}</small></div><span className="status-badge status-done">{statusLabels.completed}</span></div>) : <p className="empty-history">Tidak ada history EWO.</p>}</div></section></div>;
}
