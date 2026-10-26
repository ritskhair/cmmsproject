import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type DashboardSummary, type FailureBySection, fetchDashboardSummary } from "../../utils/api";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";

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

function FailureParetoChart({
  data,
  selectedSection,
}: {
  data: FailureBySection[];
  selectedSection: string;
}) {
  type ParetoDatum = {
    label: string;
    section: string;
    total: number;
    cumulativePercent: number;
  };

  const { chartData, grandTotal, leftTicks } = useMemo(() => {
    const sectionList = selectedSection === "all"
      ? ["1", "2", "3", "4", "5"]
      : [selectedSection];
    const sorted = sectionList
      .map((section) => ({
        section,
        total: data.find((item) => item.section === section)?.total ?? 0,
      }))
      .sort((a, b) => b.total - a.total || Number(a.section) - Number(b.section));
    const total = sorted.reduce((sum, item) => sum + item.total, 0);
    let cumulativeTotal = 0;
    const points: ParetoDatum[] = [];

    sorted.forEach((item) => {
      cumulativeTotal += item.total;
      points.push({
        label: `S${item.section}`,
        section: item.section,
        total: item.total,
        cumulativePercent: total === 0
          ? 0
          : Number(((cumulativeTotal / total) * 100).toFixed(1)),
      });
    });

    const tickMaximum = Math.max(total, 1);
    const ticks = Array.from(
      { length: 6 },
      (_, index) => Number(((tickMaximum / 5) * index).toFixed(1)),
    );
    return { chartData: points, grandTotal: total, leftTicks: ticks };
  }, [data, selectedSection]);

  const renderTooltip = ({ active, payload }: TooltipContentProps) => {
    const item = payload?.find((entry) => {
      const candidate = entry.payload as ParetoDatum | undefined;
      return Boolean(candidate?.section);
    })?.payload as ParetoDatum | undefined;
    if (!active || !item) return null;

    return (
      <div
        style={{
          padding: "10px 12px",
          background: colors.white,
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(33, 31, 29, 0.12)",
          color: colors.text,
          fontSize: "11px",
        }}
      >
        <div style={{ marginBottom: "5px", fontWeight: 700 }}>Section {item.section}</div>
        <div>Failure: {item.total}</div>
        <div>Kumulatif: {item.cumulativePercent}%</div>
      </div>
    );
  };

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

      {grandTotal === 0 ? (
        <div
          style={{
            height: "260px",
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
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
            barCategoryGap="12%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E8E3DD" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: colors.border }}
              tick={{ fill: colors.secondary, fontSize: 11 }}
              interval={0}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[0, Math.max(grandTotal, 1)]}
              ticks={leftTicks}
              tickFormatter={(value: number) => String(Number(value.toFixed(1)))}
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.secondary, fontSize: 11 }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value: number) => `${value}%`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: colors.secondary, fontSize: 11 }}
              width={38}
            />
            <Tooltip content={renderTooltip} />
            <Legend
              align="right"
              verticalAlign="top"
              height={24}
              iconSize={9}
              wrapperStyle={{ color: colors.secondary, fontSize: "10px", top: "-4px" }}
              formatter={(value: string) => value === "total" ? "Failure" : "Kumulatif"}
            />
            <ReferenceLine
              y={80}
              yAxisId="right"
              stroke={colors.red}
              strokeDasharray="5 4"
              label={{ value: "Batas 80%", position: "insideTopLeft", fill: colors.red, fontSize: 10 }}
            />
            <Bar
              dataKey="total"
              yAxisId="left"
              fill={colors.gold}
              radius={[0, 0, 0, 0]}
              maxBarSize={90}
              animationDuration={600}
              activeBar={{ fillOpacity: 0.75 }}
            />
            <Line
              dataKey="cumulativePercent"
              yAxisId="right"
              type="monotone"
              stroke={colors.maroon}
              strokeWidth={2.5}
              dot={{ r: 3, fill: colors.white, stroke: colors.maroon, strokeWidth: 2 }}
              activeDot={{ r: 4, fill: colors.white, stroke: colors.maroon, strokeWidth: 2 }}
              animationDuration={600}
            />
          </ComposedChart>
        </ResponsiveContainer>
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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadSummary(dateFrom, dateTo, section);
  }, [dateFrom, dateTo, section, loadSummary]);
  /* eslint-enable react-hooks/set-state-in-effect */

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
        <FailureParetoChart data={summary?.failure_by_section ?? []} selectedSection={section} />

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