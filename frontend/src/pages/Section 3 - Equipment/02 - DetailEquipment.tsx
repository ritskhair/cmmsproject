import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { apiRequest, type Equipment } from "../../utils/api";

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

export default function EquipmentDetail() {
  const { equipmentId } = useParams<{ equipmentId: string }>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!equipmentId) return;
    Promise.all([
      apiRequest<Equipment>(`/equipment/${equipmentId}`),
      apiRequest<HistoryItem[]>(`/equipment/${equipmentId}/history`),
    ]).then(([equipmentResult, historyResult]) => {
      setEquipment(equipmentResult);
      setHistory(historyResult);
    }).catch((requestError) => {
      setError(requestError instanceof Error ? requestError.message : "Detail equipment gagal dimuat.");
    });
  }, [equipmentId]);

  if (error) return <div className="page-container"><p className="login-error">{error}</p><Link to="/equipment" className="back-link">Kembali ke Equipment</Link></div>;
  if (!equipment) return <div className="page-container"><p>Memuat equipment...</p></div>;

  return (
    <div className="page-container">
      <header className="page-header"><h1>Equipment</h1><div className="header-profile">SA</div></header>
      <p className="page-description">Equipment detail and maintenance history</p>
      <section className="equipment-detail-header"><div className="equipment-title-area"><h2>{equipment.asset_id} | {equipment.name}</h2><span className="status-badge">{equipment.status}</span><span>Section {equipment.section}</span><span>{equipment.type}</span></div></section>
      <section className="information-grid"><div className="information-card"><h3>Asset Information</h3><p><strong>Asset ID:</strong> {equipment.asset_id}</p><p><strong>Name:</strong> {equipment.name}</p><p><strong>Type:</strong> {equipment.type}</p><p><strong>Section:</strong> {equipment.section}</p></div><div className="information-card"><h3>Maintenance Snapshot</h3><p><strong>Last PM:</strong> {equipment.last_pm ? new Date(equipment.last_pm).toLocaleString() : "-"}</p><p><strong>Status:</strong> {equipment.status}</p></div></section>
  <section className="history-section"><h2>Maintenance History</h2><div className="table-card"><div className="table-scroll"><table><thead><tr><th>EWO</th><th>Approval</th><th>Start</th><th>End</th><th>Condition After Repair</th></tr></thead><tbody>{history.map((item) => <tr key={item.id}><td>{item.ewo_number}</td><td>{item.code_approval}</td><td>{new Date(item.start_time).toLocaleString()}</td><td>{new Date(item.end_time).toLocaleString()}</td><td>{item.condition_after_repair}</td></tr>)}</tbody></table></div>{history.length === 0 && <p className="empty-state">Belum ada histori maintenance.</p>}</div></section>
  <Link to="/equipment" className="back-link">Kembali ke List Equipment</Link>
    </div>
  );
}
