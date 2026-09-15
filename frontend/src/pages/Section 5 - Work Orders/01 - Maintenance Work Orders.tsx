import {
  useMemo,
  useState,
} from "react";

import {
  dummyEwoData,
  type EwoData,
  type EwoStatus,
} from "../../datadummy/EwoData";

const statusOptions: EwoStatus[] = [
  "Pending",
  "On Progress",
  "Done",
];

export default function AdminWorkOrders() {
  const [ewoList, setEwoList] =
    useState<EwoData[]>(dummyEwoData);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const filteredEwo = useMemo(() => {
    return ewoList.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.ewoCode.toLowerCase().includes(keyword) ||
        item.equipment.toLowerCase().includes(keyword) ||
        item.requestor.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ewoList, search, statusFilter]);

  const updateStatus = (
    id: string,
    nextStatus: EwoStatus,
  ) => {
    setEwoList((previous) =>
      previous.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          status: nextStatus,
          completedAt:
            nextStatus === "Done"
              ? new Date().toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  },
                )
              : undefined,
        };
      }),
    );
  };

  const total = ewoList.length;

  const pending = ewoList.filter(
    (item) => item.status === "Pending",
  ).length;

  const onProgress = ewoList.filter(
    (item) => item.status === "On Progress",
  ).length;

  const done = ewoList.filter(
    (item) => item.status === "Done",
  ).length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>
            Work Orders
          </h1>

          <p style={styles.subtitle}>
            Monitoring Emergency Work Order
          </p>
        </div>

        <div style={styles.avatar}>
          SA
        </div>
      </header>

      <section style={styles.summaryGrid}>
        <SummaryCard
          label="Total Work Orders"
          value={total}
          color="#751b17"
        />

        <SummaryCard
          label="Pending"
          value={pending}
          color="#c17b18"
        />

        <SummaryCard
          label="On Progress"
          value={onProgress}
          color="#2563eb"
        />

        <SummaryCard
          label="Done"
          value={done}
          color="#2f8f3b"
        />
      </section>

      <section style={styles.card}>
        <div style={styles.toolbar}>
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search EWO code, equipment, requestor..."
            style={styles.search}
          />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={styles.filter}
          >
            <option value="All">
              All Status
            </option>

            {statusOptions.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  EWO Code
                </th>

                <th style={styles.th}>
                  Requestor
                </th>

                <th style={styles.th}>
                  Equipment
                </th>

                <th style={styles.th}>
                  Section
                </th>

                <th style={styles.th}>
                  Created
                </th>

                <th style={styles.th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEwo.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>
                    <strong>
                      {item.ewoCode}
                    </strong>
                  </td>

                  <td style={styles.td}>
                    {item.requestor}
                  </td>

                  <td style={styles.td}>
                    {item.equipment}
                  </td>

                  <td style={styles.td}>
                    {item.section}
                  </td>

                  <td style={styles.td}>
                    {item.createdAt}
                  </td>

                  <td style={styles.td}>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        updateStatus(
                          item.id,
                          event.target.value as EwoStatus,
                        )
                      }
                      style={{
                        ...styles.statusSelect,
                        color: getStatusColor(
                          item.status,
                        ),
                      }}
                    >
                      {statusOptions.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                </tr>
              ))}

              {filteredEwo.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={styles.empty}
                  >
                    Tidak ada EWO yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          History EWO
        </h2>

        <div style={styles.historyList}>
          {ewoList
            .filter(
              (item) => item.status === "Done",
            )
            .map((item) => (
              <div
                key={item.id}
                style={styles.historyItem}
              >
                <div>
                  <strong>
                    {item.ewoCode}
                  </strong>

                  <p style={styles.historyText}>
                    {item.equipment} —{" "}
                    {item.requestor}
                  </p>
                </div>

                <div style={styles.historyDate}>
                  {item.completedAt ||
                    "Belum selesai"}
                </div>
              </div>
            ))}

          {done === 0 && (
            <p>
              Belum terdapat EWO yang selesai.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={styles.summaryCard}>
      <p style={styles.summaryLabel}>
        {label}
      </p>

      <strong
        style={{
          ...styles.summaryValue,
          color,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function getStatusColor(
  status: EwoStatus,
) {
  if (status === "Done") {
    return "#2f8f3b";
  }

  if (status === "On Progress") {
    return "#2563eb";
  }

  return "#c17b18";
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f5",
    padding: "28px",
  },

  header: {
    background: "#ffffff",
    borderRadius: "10px",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },

  pageTitle: {
    margin: 0,
    color: "#751b17",
    fontSize: "28px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#666666",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid #dddddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#751b17",
    fontWeight: 700,
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  summaryCard: {
    background: "#ffffff",
    border: "1px solid #dddddd",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
  },

  summaryLabel: {
    color: "#666666",
    margin: 0,
  },

  summaryValue: {
    display: "block",
    fontSize: "32px",
    marginTop: "8px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "24px",
    border: "1px solid #dddddd",
  },

  toolbar: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  search: {
    flex: 1,
    minWidth: "220px",
    padding: "12px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
  },

  filter: {
    padding: "12px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    background: "#ffffff",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },

  th: {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #222222",
    fontSize: "13px",
    color: "#555555",
  },

  td: {
    padding: "16px 12px",
    borderBottom: "1px solid #eeeeee",
    fontSize: "14px",
  },

  statusSelect: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cccccc",
    background: "#ffffff",
    fontWeight: 600,
  },

  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#777777",
  },

  sectionTitle: {
    color: "#751b17",
    marginTop: 0,
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
  },

  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    padding: "14px 0",
    borderBottom: "1px solid #eeeeee",
  },

  historyText: {
    margin: "6px 0 0",
    color: "#666666",
  },

  historyDate: {
    color: "#2f8f3b",
    fontWeight: 600,
  },
};