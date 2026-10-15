import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type DashboardSummary, type FailureBySection, fetchDashboardSummary } from "../../utils/api";

// ─── helpers ────────────────────────────────────────────────────────────────

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function todayDate(): Date {
  return new Date();
}

function firstDayOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  return d;
}

function formatDisplayDate(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day)} ${monthNames[parseInt(month) - 1]} ${year}`;
}

// ─── colour tokens ──────────────────────────────────────────────────────────

const colors = {
  maroon: "#681813",
  gold: "#C9A227",
  goldLight: "#E3C770",
  background: "#F6F5F2",
  text: "#211F1D",
  secondary: "#5C5954",
  border: "#D6D1C9",
  green: "#2E7D33",
  orange: "#B8781F",
  red: "#B22417",
  white: "#ffffff",
};

// ─── sub-components ─────────────────────────────────────────────────────────

function KpiCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="dashboard-kpi-card">
      <div style={{ color: colors.secondary, fontSize: "11px", fontWeight: 700 }}>
        {title}
      </div>
      <div style={{ marginTop: "10px", color: colors.maroon, fontSize: "26px", fontWeight: 700 }}>
        {value}
      </div>
      {sub && (
        <div style={{ marginTop: "8px", fontSize: "10px", color: colors.secondary }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function FailureParetoChart({ data }: { data: FailureBySection[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div
      style={{
        minWidth: 0,
        minHeight: "287px",
        padding: "18px",
        background: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
      }}
    >
      <h2 style={{ margin: 0, fontSize: "15px", color: colors.text }}>Failure Pareto</h2>
      <p style={{ margin: "5px 0 20px", color: colors.secondary, fontSize: "11px" }}>
        Total failure per section dalam periode ini
      </p>

      {data.length === 0 ? (
        <div
          style={{
            height: "150px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.secondary,
            fontSize: "12px",
          }}
        >
          Tidak ada data pada periode ini
        </div>
      ) : (
        <>
          <div
            style={{
              height: "150px",
              display: "flex",
              alignItems: "flex-end",
              gap: "8%",
              padding: "0 10px",
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            {data.map((item) => (
              <div
                key={item.section}
                title={`Section ${item.section}: ${item.total} failures`}
                style={{
                  flex: 1,
                  height: `${(item.total / max) * 140}px`,
                  background: colors.gold,
                  borderRadius: "3px 3px 0 0",
                  position: "relative",
                  cursor: "default",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-18px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: colors.maroon,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.total}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "8px",
              fontSize: "12px",
              color: colors.secondary,
            }}
          >
            {data.map((item) => (
              <span key={item.section}>S{item.section}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Filter Panel Overlay ────────────────────────────────────────────────────

function FilterPanel({
  dateFrom,
  dateTo,
  section,
  onApply,
  onReset,
  onClose,
}: {
  dateFrom: string;
  dateTo: string;
  section: string;
  onApply: (from: string, to: string, sec: string) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [localFrom, setLocalFrom] = useState(dateFrom);
  const [localTo, setLocalTo] = useState(dateTo);
  const [localSection, setLocalSection] = useState(section);

  const handleApply = () => {
    onApply(localFrom, localTo, localSection);
  };

  const handleReset = () => {
    const defaultFrom = toISODate(firstDayOfMonth());
    const defaultTo = toISODate(todayDate());
    setLocalFrom(defaultFrom);
    setLocalTo(defaultTo);
    setLocalSection("all");
    onReset();
  };

  return (
    <div className="filter-panel-overlay" onClick={onClose}>
      <div className="filter-panel-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-panel-header">
          <h2>Filter Dashboard</h2>
          <button type="button" className="filter-panel-close" onClick={onClose}>✕</button>
        </div>

        <div className="filter-panel-body">
          <div className="filter-panel-field">
            <label htmlFor="filter-from">Dari</label>
            <input
              id="filter-from"
              type="date"
              value={localFrom}
              max={localTo || undefined}
              onChange={(e) => setLocalFrom(e.target.value)}
            />
          </div>

          <div className="filter-panel-field">
            <label htmlFor="filter-to">Sampai</label>
            <input
              id="filter-to"
              type="date"
              value={localTo}
              min={localFrom || undefined}
              onChange={(e) => setLocalTo(e.target.value)}
            />
          </div>

          <div className="filter-panel-field">
            <label htmlFor="filter-section">Section</label>
            <select
              id="filter-section"
              value={localSection}
              onChange={(e) => setLocalSection(e.target.value)}
            >
              <option value="all">All Section</option>
              <option value="1">Section 1</option>
              <option value="2">Section 2</option>
              <option value="3">Section 3</option>
              <option value="4">Section 4</option>
              <option value="5">Section 5</option>
            </select>
          </div>
        </div>

        <div className="filter-panel-actions">
          <button type="button" className="filter-apply-btn" onClick={handleApply}>
            Apply
          </button>
          <button type="button" className="filter-reset-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export default function MaintenanceDashboard() {
  const [dateFrom, setDateFrom] = useState(toISODate(firstDayOfMonth()));
  const [dateTo, setDateTo] = useState(toISODate(todayDate()));
  const [section, setSection] = useState("all");

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const loadSummary = useCallback(async (from: string, to: string, sec: string) => {
    if (!from || !to) return;
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardSummary(from, to, sec === "all" ? undefined : sec);
      setSummary(data);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary(dateFrom, dateTo, section);
  }, [dateFrom, dateTo, section, loadSummary]);

  const handleFilterApply = (from: string, to: string, sec: string) => {
    setDateFrom(from);
    setDateTo(to);
    setSection(sec);
    setFilterOpen(false);
  };

  const handleFilterReset = () => {
    setDateFrom(toISODate(firstDayOfMonth()));
    setDateTo(toISODate(todayDate()));
    setSection("all");
    setFilterOpen(false);
  };

  const mttrDisplay = useMemo(() => {
    if (!summary) return "—";
    if (summary.mttr_minutes === null) return "N/A";
    return `${summary.mttr_minutes} min`;
  }, [summary]);

  const equip = summary?.equipment_status;
  const totalEquip = equip ? equip.operational + equip.warning + equip.critical : 0;
  const pct = (n: number) =>
    totalEquip > 0 ? `${Math.round((n / totalEquip) * 100)}%` : "0%";

  return (
    <div className="main-dashboard">
      {/* HEADER — Filter button added */}
      <header className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, color: colors.maroon, fontSize: "24px", fontWeight: 700 }}>
            Dashboard
          </h1>
          <p style={{ margin: "3px 0 0", color: colors.secondary, fontSize: "12px" }}>
            {formatDisplayDate(dateFrom)} — {formatDisplayDate(dateTo)}
            {section !== "all" ? ` · Section ${section}` : " · Semua Section"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {loading && (
            <span style={{ fontSize: "11px", color: colors.secondary, fontStyle: "italic" }}>
              Memuat…
            </span>
          )}
          <button
            type="button"
            className="dashboard-filter-btn"
            onClick={() => setFilterOpen(true)}
          >
            <span style={{ fontSize: "16px" }}>⚙</span> Filter
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

      {/* FILTER PANEL OVERLAY */}
      {filterOpen && (
        <FilterPanel
          dateFrom={dateFrom}
          dateTo={dateTo}
          section={section}
          onApply={handleFilterApply}
          onReset={handleFilterReset}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* ERROR BANNER */}
      {error && (
        <div
          style={{
            margin: "0 0 12px",
            padding: "12px 16px",
            background: "#FEF2F2",
            border: `1px solid ${colors.red}`,
            borderRadius: "8px",
            color: colors.red,
            fontSize: "12px",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* KPI CARDS */}
      <section className="dashboard-kpi-grid">
        <KpiCard title="MTTR" value={mttrDisplay} sub="rata-rata waktu perbaikan" />
        <KpiCard
          title="Total Failures"
          value={summary ? String(summary.total_failures) : "—"}
          sub="EWO dalam periode ini"
        />
        <KpiCard
          title="Open Work Orders"
          value={summary ? String(summary.open_work_orders) : "—"}
          sub="belum selesai"
        />
        <KpiCard
          title="Operational"
          value={equip ? String(equip.operational) : "—"}
          sub={equip ? `${pct(equip.operational)} dari total aset` : undefined}
        />
        <KpiCard
          title="Warning / Critical"
          value={equip ? `${equip.warning} / ${equip.critical}` : "—"}
          sub="perlu perhatian"
        />
      </section>

      {/* CHART AND EQUIPMENT STATUS */}
      <section className="dashboard-chart-grid">
        <FailureParetoChart data={summary?.failure_by_section ?? []} />

        <div
          style={{
            padding: "18px",
            background: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "15px", color: colors.text }}>Equipment Status</h2>
          <p style={{ margin: "5px 0 15px", color: colors.secondary, fontSize: "11px" }}>
            Ketersediaan aset saat ini
          </p>

          {(
            [
              ["Operational", equip?.operational ?? 0, pct(equip?.operational ?? 0), colors.green],
              ["Warning",     equip?.warning     ?? 0, pct(equip?.warning     ?? 0), colors.orange],
              ["Critical",    equip?.critical    ?? 0, pct(equip?.critical    ?? 0), colors.red],
            ] as [string, number, string, string][]
          ).map(([status, count, percentage, color]) => (
            <div
              key={status}
              style={{
                display: "grid",
                gridTemplateColumns: "12px 1fr 45px 40px",
                alignItems: "center",
                gap: "8px",
                padding: "12px",
                marginBottom: "12px",
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
                  display: "inline-block",
                }}
              />
              <strong>{status}</strong>
              <strong style={{ color: colors.maroon, fontSize: "18px" }}>{count}</strong>
              <span style={{ color: colors.secondary }}>{percentage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "20px 24px",
          background: colors.white,
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
    </div>
  );
}