import { useMemo, useState } from "react";

type WorkOrder = {
  code: string;
  machine: string;
  requestor: string;
  priority: "Critical" | "High" | "Medium";
  section: string;
};


const initialWorkOrders: WorkOrder[] = [
  {
    code: "WO-2026-081",
    machine: "Pellet Mill 01",
    requestor: "Tutur",
    priority: "Critical",
    section: "Section 1",
  },
  {
    code: "WO-2026-082",
    machine: "Rotary Dryer",
    requestor: "Nastain",
    priority: "High",
    section: "Section 2",
  },
  {
    code: "WO-2026-083",
    machine: "WHM 02",
    requestor: "Heri",
    priority: "Medium",
    section: "Section 3",
  },
];

const colors = {
  maroon: "#681813",
  maroonLight: "#87241C",
  maroonDark: "#59120E",
  gold: "#C9A227",
  goldLight: "#E3C770",
  background: "#F6F5F2",
  text: "#211F1D",
  secondary: "#5C5954",
  border: "#D6D1C9",
  green: "#2E7D33",
  orange: "#B8781F",
  red: "#B22417",
};

export default function MaintenanceDashboard() {
  const [period, setPeriod] = useState("29 Aug 2026");
  const [focusSection, setFocusSection] = useState("All Section");
  const [searchText, setSearchText] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);

  const [selectedWorkOrder, setSelectedWorkOrder] =
    useState<WorkOrder | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredWorkOrders = useMemo(() => {
    const keyword = searchText.toLowerCase().trim();

    return workOrders.filter((workOrder) => {
      const matchesSearch =
        keyword === "" ||
        workOrder.code.toLowerCase().includes(keyword) ||
        workOrder.machine.toLowerCase().includes(keyword) ||
        workOrder.requestor.toLowerCase().includes(keyword) ||
        workOrder.priority.toLowerCase().includes(keyword);

      const matchesSection =
        focusSection === "All Section" ||
        workOrder.section === focusSection;

      return matchesSearch && matchesSection;
    });
  }, [workOrders, searchText, focusSection]);

  const handleReset = () => {
    setPeriod("29 Aug 2026");
    setFocusSection("All Section");
    setSearchText("");
    setIsSearchOpen(false);
  };

  const handleEdit = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedWorkOrder) return;

    setWorkOrders((currentWorkOrders) =>
      currentWorkOrders.map((workOrder) =>
        workOrder.code === selectedWorkOrder.code
          ? selectedWorkOrder
          : workOrder
      )
    );

    setIsEditModalOpen(false);
    setSelectedWorkOrder(null);
  };

  const getPriorityColor = (priority: WorkOrder["priority"]) => {
    if (priority === "Critical") return colors.red;
    return colors.orange;
  };

  return (
  <div className="main-dashboard">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1
              style={{
                margin: 0,
                color: colors.maroon,
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: "3px 0 0",
                color: colors.secondary,
                fontSize: "12px",
              }}
            >
              Good morning, ADMIN. Here is today’s maintenance overview.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {isSearchOpen && (
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search work order..."
                autoFocus
                style={{
                  width: "220px",
                  height: "36px",
                  padding: "0 12px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "12px",
                }}
              />
            )}

            <button
              type="button"
              onClick={() => setIsSearchOpen((current) => !current)}
              title="Search work order"
              style={{
                border: "none",
                background: "transparent",
                color: colors.maroon,
                fontSize: "23px",
                cursor: "pointer",
              }}
            >
              ⌕
            </button>

            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: colors.background,
                border: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.maroon,
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              ADM
            </div>
          </div>
        </header>

        {/* FILTERS */}
        <section className="dashboard-filters">
          <div className="filter-fields">
            <label className="filter-field">
                Period

                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                >
                  <option value="29 Aug 2026">29 Aug 2026</option>
                  <option value="28 Aug 2026">28 Aug 2026</option>
                  <option value="27 Aug 2026">27 Aug 2026</option>
                  <option value="26 Aug 2026">26 Aug 2026</option>
                </select>
              </label>

            <label className="filter-field">
              Focus Section

              <select
                value={focusSection}
                onChange={(event) => setFocusSection(event.target.value)}
              >
                <option value="All Section">All Section</option>
                <option value="Section 1">Section 1</option>
                <option value="Section 2">Section 2</option>
                <option value="Section 3">Section 3</option>
                <option value="Section 4">Section 4</option>
                <option value="Section 5">Section 5</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="reset-button"
            onClick={handleReset}
          >
            Reset
          </button>
        </section>

        {/* KPI CARDS */}
        <section className="dashboard-kpi-grid">
          {[
            ["MTTR", "139.3 min", "↓ 8.2%", "vs last month"],
            ["Total Failure", "113", "↓ 12.5%", "incidents"],
            ["Downtime", "263.4 h", "↓ 6.8%", "this period"],
            ["PM Compliance", "94.2%", "↑ 3.4%", "target 95%"],
            ["Open Work Orders", "24", "6 urgent", "active backlog"],
          ].map(([title, value, change, description]) => (
            <div className="dashboard-kpi-card">
              <div
                style={{
                  color: colors.secondary,
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                {title}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  color: colors.maroon,
                  fontSize: "26px",
                  fontWeight: 700,
                }}
              >
                {value}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  gap: "5px",
                  flexWrap: "wrap",
                  alignItems: "center",
                  fontSize: "10px",
                }}
              >
                <span
                  style={{
                    color: change.includes("urgent")
                      ? colors.orange
                      : colors.green,
                    fontWeight: 700,
                  }}
                >
                  {change}
                </span>

                <span style={{ color: colors.secondary }}>
                  {description}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* CHART AND EQUIPMENT STATUS */}
        <section className="dashboard-chart-grid">
          {/* FAILURE PARETO */}
          <div
            style={{
              minWidth: 0,
              minHeight: "287px",
              padding: "18px",
              background: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                color: colors.text,
              }}
            >
              Failure Pareto
            </h2>

            <p
              style={{
                margin: "5px 0 20px",
                color: colors.secondary,
                fontSize: "11px",
              }}
            >
              Top failure categories by occurrence
            </p>

            <div
              style={{
                height: "150px",
                display: "flex",
                alignItems: "flex-end",
                gap: "8%",
                padding: "0 10px",
                borderBottom: "1px solid #D6D1C9",
              }}
            >
              {[112, 84, 64, 38, 15].map((height, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${height}px`,
                    background: "#C5A05A",
                    borderRadius: "3px 3px 0 0",
                  }}
                />
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "8px",
                fontSize: "12px",
              }}
            >
              {["S1", "S2", "S5", "S3", "S4"].map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>

          {/* EQUIPMENT STATUS */}
          <div
            style={{
              padding: "18px",
              background: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                color: colors.text,
              }}
            >
              Equipment Status
            </h2>

            <p
              style={{
                margin: "5px 0 15px",
                color: colors.secondary,
                fontSize: "11px",
              }}
            >
              Current plant availability
            </p>

            {[
              ["Operational", "28", "83%", colors.green],
              ["Warning", "4", "12%", colors.orange],
              ["Critical", "2", "5%", colors.red],
            ].map(([status, count, percentage, color]) => (
              <div
                key={status}
                style={{
                  display: "grid",
                  gridTemplateColumns: "12px 1fr 45px 40px",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px",
                  marginBottom: "20px",
                  background: colors.background,
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    background: color,
                    borderRadius: "50%",
                  }}
                />

                <strong>{status}</strong>

                <strong
                  style={{
                    color: colors.maroon,
                    fontSize: "18px",
                  }}
                >
                  {count}
                </strong>

                <span style={{ color: colors.secondary }}>
                  {percentage}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* WORK ORDERS AND COMPLIANCE */}
        <section className="dashboard-bottom-grid">
          {/* OPEN WORK ORDERS */}
          <div
            style={{
              minWidth: 0,
              padding: "10px",
              background: "white",
              border: `1px solid ${colors.border}`,
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                Open Work Orders
              </h2>

              <span
                style={{
                  color: colors.secondary,
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                }}
              >
                Priority queue requiring attention
              </span>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "10px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid black",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "8px 4px", color: colors.maroon }}>
                    EWO Code
                  </th>
                  <th style={{ padding: "8px 4px" }}>Machine</th>
                  <th style={{ padding: "8px 4px" }}>Requestor</th>
                  <th style={{ padding: "8px 4px", color: colors.red }}>
                    Priority
                  </th>
                  <th style={{ padding: "8px 4px" }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredWorkOrders.map((workOrder) => (
                  <tr key={workOrder.code}>
                    <td
                      style={{
                        padding: "8px 4px",
                        color: colors.maroon,
                        fontWeight: 700,
                      }}
                    >
                      {workOrder.code}
                    </td>

                    <td style={{ padding: "8px 4px" }}>
                      {workOrder.machine}
                    </td>

                    <td style={{ padding: "8px 4px" }}>
                      {workOrder.requestor}
                    </td>

                    <td
                      style={{
                        padding: "8px 4px",
                        color: getPriorityColor(workOrder.priority),
                        fontWeight: 700,
                      }}
                    >
                      {workOrder.priority}
                    </td>

                    <td style={{ padding: "8px 4px" }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(workOrder)}
                        style={{
                          padding: "4px 8px",
                          border: `1px solid ${colors.maroon}`,
                          borderRadius: "5px",
                          background: "white",
                          color: colors.maroon,
                          fontSize: "10px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredWorkOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: colors.secondary,
                      }}
                    >
                      No work orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* COMPLIANCE */}
          <div
            style={{
              minHeight: "150px",
              padding: "20px",
              width: "100%",
              minWidth: 0,
              background: colors.maroon,
              borderRadius: "12px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {[
              ["PM Compliance", "94.2%"],
              ["AM Compliance", "90.2%"],
            ].map(([title, percentage]) => (
              <div key={title}>
                <h2
                  style={{
                    margin: 0,
                    color: "white",
                    fontSize: "14px",
                  }}
                >
                  {title}
                </h2>

                <div
                  style={{
                    marginTop: "20px",
                    color: colors.goldLight,
                    fontSize: "28px",
                    fontWeight: 700,
                    textAlign: "center",
                  }}
                >
                  {percentage}
                </div>

                <div
                  style={{
                    color: "#F0E5D6",
                    fontSize: "10px",
                    textAlign: "center",
                  }}
                >
                  Target: 95% • 0.8% gap to target
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer
          style={{
            padding: "20px 24px",
            background: "white",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#9CA3AF",
            fontSize: "12px",
          }}
        >
          <span>
            Copyright © 2026{" "}
            <strong style={{ color: colors.gold }}>CMMS - JWP.</strong>{" "}
            All rights reserved.
          </span>

          <span>CMMS</span>
        </footer>
      

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedWorkOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "420px",
              maxWidth: "100%",
              padding: "24px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                color: colors.maroon,
                fontSize: "20px",
              }}
            >
              Edit Work Order
            </h2>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              EWO Code

              <input
                value={selectedWorkOrder.code}
                disabled
                style={{
                  height: "38px",
                  padding: "0 10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "7px",
                  background: colors.background,
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Machine

              <input
                value={selectedWorkOrder.machine}
                onChange={(event) =>
                  setSelectedWorkOrder({
                    ...selectedWorkOrder,
                    machine: event.target.value,
                  })
                }
                style={{
                  height: "38px",
                  padding: "0 10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "7px",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "14px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Requestor

              <input
                value={selectedWorkOrder.requestor}
                onChange={(event) =>
                  setSelectedWorkOrder({
                    ...selectedWorkOrder,
                    requestor: event.target.value,
                  })
                }
                style={{
                  height: "38px",
                  padding: "0 10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "7px",
                }}
              />
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                marginBottom: "20px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              Priority

              <select
                value={selectedWorkOrder.priority}
                onChange={(event) =>
                  setSelectedWorkOrder({
                    ...selectedWorkOrder,
                    priority: event.target.value as WorkOrder["priority"],
                  })
                }
                style={{
                  height: "38px",
                  padding: "0 10px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "7px",
                  background: "white",
                }}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
              </select>
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedWorkOrder(null);
                }}
                style={{
                  padding: "10px 18px",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "7px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                style={{
                  padding: "10px 18px",
                  border: "none",
                  borderRadius: "7px",
                  background: colors.maroon,
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}