import {useMemo,useState,} from "react";

import {
  dummyEwoData,
  type EwoData,
  type EwoStatus,
} from "../../datadummy/EwoData";


export default function WorkOrders() {
  const [ewoData, setEwoData] = useState<EwoData[]>(dummyEwoData);

  const [currentSearch, setCurrentSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Data EWO yang masih aktif
  const currentEwo = useMemo(() => {
    return ewoData.filter((ewo) => {
      const isNotDone = ewo.status !== "Done";

      const searchText = `
        ${ewo.ewoCode}
        ${ewo.requestor}
        ${ewo.equipment}
        ${ewo.section}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        currentSearch.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "All Status" ||
        ewo.status === statusFilter;

      return isNotDone && matchesSearch && matchesStatus;
    });
  }, [ewoData, currentSearch, statusFilter]);

  // Data yang sudah selesai dan masuk history
  const historyEwo = useMemo(() => {
    return ewoData.filter((ewo) => {
      const isDone = ewo.status === "Done";

      const searchText = `
        ${ewo.ewoCode}
        ${ewo.requestor}
        ${ewo.equipment}
        ${ewo.section}
      `.toLowerCase();

      return (
        isDone &&
        searchText.includes(historySearch.toLowerCase())
      );
    });
  }, [ewoData, historySearch]);

  // Mengubah status EWO
  const handleStatusChange = (
    id: string,
    newStatus: EwoStatus
  ) => {
    setEwoData((previousData) =>
      previousData.map((ewo) => {
        if (ewo.id !== id) {
          return ewo;
        }

        return {
          ...ewo,
          status: newStatus,
          completedAt:
            newStatus === "Done"
              ? ewo.completedAt ?? "15 Sep 2026"
              : undefined,
        };
      })
    );
  };

  const totalEwo = ewoData.length;
  const pendingEwo = ewoData.filter(
    (ewo) => ewo.status === "Pending"
  ).length;
  const onProgressEwo = ewoData.filter(
    (ewo) => ewo.status === "On Progress"
  ).length;
  const doneEwo = ewoData.filter(
    (ewo) => ewo.status === "Done"
  ).length;

  return (
    <div className="work-orders-page">
      <header className="page-header">
        <div>
          <h1>Work Orders</h1>
          <p>Monitoring Emergency Work Order</p>
        </div>

        <div className="profile-initial">SA</div>
      </header>

      {/* ================= KPI ================= */}
      <section className="ewo-kpi-grid">
        <div className="ewo-kpi-card">
          <span>Total Work Orders</span>
          <strong>{totalEwo}</strong>
        </div>

        <div className="ewo-kpi-card">
          <span>Pending</span>
          <strong className="status-pending">
            {pendingEwo}
          </strong>
        </div>

        <div className="ewo-kpi-card">
          <span>On Progress</span>
          <strong className="status-progress">
            {onProgressEwo}
          </strong>
        </div>

        <div className="ewo-kpi-card">
          <span>Done</span>
          <strong className="status-done">
            {doneEwo}
          </strong>
        </div>
      </section>

      {/* ================= EWO SAAT INI ================= */}
      <section className="ewo-section">
        <div className="section-title">
          <h2>EWO Saat Ini</h2>
          <p>Daftar EWO yang masih dalam proses penanganan</p>
        </div>

        <div className="ewo-toolbar">
          <input
            type="text"
            placeholder="Search EWO code, equipment, requestor..."
            value={currentSearch}
            onChange={(event) =>
              setCurrentSearch(event.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="On Progress">On Progress</option>
          </select>
        </div>

        <div className="ewo-table-wrapper">
          <table className="ewo-table">
            <thead>
              <tr>
                <th>EWO Code</th>
                <th>Requestor</th>
                <th>Equipment</th>
                <th>Section</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {currentEwo.length > 0 ? (
                currentEwo.map((ewo) => (
                  <tr key={ewo.id}>
                    <td>
                      <strong>{ewo.ewoCode}</strong>
                    </td>
                    <td>{ewo.requestor}</td>
                    <td>{ewo.equipment}</td>
                    <td>{ewo.section}</td>
                    <td>{ewo.createdAt}</td>
                    <td>
                      <select
                        className={`status-select ${getStatusClass(
                          ewo.status
                        )}`}
                        value={ewo.status}
                        onChange={(event) =>
                          handleStatusChange(
                            ewo.id,
                            event.target.value as EwoStatus
                          )
                        }
                      >
                        <option value="Pending">
                          Pending
                        </option>
                        <option value="On Progress">
                          On Progress
                        </option>
                        <option value="Done">
                          Done
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-row">
                    Tidak ada EWO aktif.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= HISTORY EWO ================= */}
      <section className="ewo-section">
        <div className="section-title">
          <h2>History EWO</h2>
          <p>Daftar EWO yang telah selesai ditangani</p>
        </div>

        <div className="history-toolbar">
          <input
            type="text"
            placeholder="Search history EWO..."
            value={historySearch}
            onChange={(event) =>
              setHistorySearch(event.target.value)
            }
          />
        </div>

        <div className="history-list">
          {historyEwo.length > 0 ? (
            historyEwo.map((ewo) => (
              <div className="history-item" key={ewo.id}>
                <div>
                  <strong>{ewo.ewoCode}</strong>
                  <p>
                    {ewo.equipment} — {ewo.requestor}
                  </p>
                  <small>
                    Section {ewo.section} · Dibuat{" "}
                    {ewo.createdAt}
                  </small>
                </div>

                <div className="history-right">
                  <span className="status-badge status-done">
                    Done
                  </span>

                  <span>
                    {ewo.completedAt ?? "-"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-history">
              Tidak ada history EWO yang sesuai.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function getStatusClass(status: EwoStatus) {
  switch (status) {
    case "Pending":
      return "status-pending";

    case "On Progress":
      return "status-progress";

    case "Done":
      return "status-done";

    default:
      return "";
  }
}
