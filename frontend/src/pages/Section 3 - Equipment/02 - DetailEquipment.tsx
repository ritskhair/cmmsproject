import { Link, useParams } from "react-router-dom";

import { equipmentData } from "../../datadummy/EquipmentData";

export default function EquipmentDetail() {
  const { equipmentId } = useParams<{ equipmentId: string }>();

  const equipment = equipmentData.find(
    (item) => item.id === equipmentId
  );

  if (!equipment) {
    return (
      <div className="page-container">
        <h1>Equipment tidak ditemukan</h1>

        <p>
          Data equipment dengan ID{" "}
          <strong>{equipmentId}</strong> tidak tersedia.
        </p>

        <Link to="/equipment" className="back-link">
          ← Kembali ke List Equipment
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header halaman */}
      <header className="page-header">
        <h1>Equipment</h1>

        <div className="header-profile">SA</div>
      </header>

      <p className="page-description">
        Equipment detail and maintenance history
      </p>

      {/* Header detail equipment */}
      <section className="equipment-detail-header">
        <div className="equipment-title-area">
          <h2>
            {equipment.id} | {equipment.name}
          </h2>

          <span className="status-badge">
            {equipment.status}
          </span>

          <span>
            {equipment.area}
          </span>

          <span>
            Criticality {equipment.criticality}
          </span>
        </div>

        <div className="detail-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              alert(
                `Edit ${equipment.id} masih berupa simulasi frontend.`
              )
            }
          >
            Edit Equipment
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              alert(
                `Create WO untuk ${equipment.id} masih berupa simulasi frontend.`
              )
            }
          >
            Create WO
          </button>
        </div>
      </section>

      {/* Informasi equipment */}
      <section className="information-grid">
        <div className="information-card">
          <h3>Asset Information</h3>

          <p>
            <strong>Manufacturer:</strong>{" "}
            {equipment.manufacturer}
          </p>

          <p>
            <strong>Model:</strong> {equipment.model}
          </p>

          <p>
            <strong>Capacity:</strong> {equipment.capacity}
          </p>

          <p>
            <strong>Installed:</strong> {equipment.installed}
          </p>

          <p>
            <strong>Location:</strong> {equipment.location}
          </p>
        </div>

        <div className="information-card">
          <h3>Maintenance Snapshot</h3>

          <p>
            <strong>MTBF:</strong> {equipment.mtbf}
          </p>

          <p>
            <strong>MTTR:</strong> {equipment.mttr}
          </p>

          <p>
            <strong>Downtime YTD:</strong>{" "}
            {equipment.downtimeYTD}
          </p>

          <p>
            <strong>Failure count:</strong>{" "}
            {equipment.failureCount}
          </p>

          <p>
            <strong>Next PM:</strong> {equipment.nextPM}
          </p>
        </div>
      </section>

      {/* Maintenance history */}
      <section className="history-section">
        <h2>Maintenance History</h2>

        <div className="table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Downtime</th>
                  <th>WO</th>
                </tr>
              </thead>

              <tbody>
                {equipment.maintenanceHistory.map((history) => (
                  <tr key={history.wo}>
                    <td className="equipment-link">
                      {history.date}
                    </td>

                    <td>{history.event}</td>
                    <td>{history.type}</td>
                    <td>{history.technician}</td>
                    <td>{history.status}</td>
                    <td>{history.downtime}</td>
                    <td>{history.wo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Link to="/equipment" className="back-link">
        ← Kembali ke List Equipment
      </Link>
    </div>
  );
}