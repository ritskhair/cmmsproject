import { useCallback, useEffect, useRef, useState } from "react";
import {
  apiRequest,
  createSiloMapping,
  deleteSiloDependency,
  fetchSiloMappings,
  fetchSiloReadings,
  fetchSiloSensors,
  fetchSiloSourceStatus,
  updateSiloMapping,
  type Equipment,
  type SiloMapping,
  type SiloReading,
  type SiloSensor,
  type SiloSourceStatus,
} from "../../utils/api";
import { getAuthSession } from "../../utils/auth";

function formatTime(value: string | null) {
  return value ? new Date(value).toLocaleString("id-ID") : "Belum tersedia";
}

export default function SiloMonitoring() {
  const [readings, setReadings] = useState<SiloReading[]>([]);
  const [sensors, setSensors] = useState<SiloSensor[]>([]);
  const [mappings, setMappings] = useState<SiloMapping[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [sourceStatus, setSourceStatus] = useState<SiloSourceStatus | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdmin = getAuthSession()?.role === "super_admin";

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const currentStatus = await fetchSiloSourceStatus();
      setSourceStatus(currentStatus);
      if (!currentStatus.connected) {
        setReadings([]);
        setSensors([]);
        return;
      }
      const [currentReadings, availableSensors] = await Promise.all([
        fetchSiloReadings(),
        isAdmin ? fetchSiloSensors() : Promise.resolve([]),
      ]);
      setReadings(currentReadings);
      setSensors(availableSensors);
      if (isAdmin) {
        const [currentMappings, currentEquipment] = await Promise.all([
          fetchSiloMappings(),
          apiRequest<Equipment[]>("/equipment"),
        ]);
        setMappings(currentMappings);
        setEquipment(currentEquipment);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Pembacaan silo gagal");
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <section className="main-dashboard">
      <header className="dashboard-header">
        <div className="silo-page-title">
          <span className="silo-eyebrow">OPERATIONS / TELEMETRY</span>
          <h1>Silo Dependency</h1>
          <p>Hubungkan silo dari ExecuSys dengan equipment CMMS yang terdampak.</p>
        </div>
        <button className="silo-refresh-button" type="button" onClick={() => void load()} disabled={loading}>
          <span aria-hidden="true">↻</span> {loading ? "Memuat..." : "Refresh"}
        </button>
      </header>
      {sourceStatus && (
        <div className={`silo-source-banner ${sourceStatus.connected ? "connected" : "disconnected"}`} role="status">
          <span className="silo-source-dot" aria-hidden="true" />
          <div>
            <strong>{sourceStatus.connected ? "ExecuSys terhubung" : "ExecuSys belum terhubung"}</strong>
            <span>{sourceStatus.message}</span>
          </div>
        </div>
      )}
      {error && <p role="alert" className="form-error silo-error">{error}</p>}
      {sourceStatus?.connected && (
        <div className="silo-summary-grid">
          <div className="silo-summary-card"><span>Sensor tersedia</span><strong>{sourceStatus.sensor_count}</strong></div>
          <div className="silo-summary-card"><span>Silo terhubung</span><strong>{new Set(mappings.filter((item) => item.enabled).map((item) => `${item.device_id}:${item.tag}`)).size}</strong></div>
          <div className="silo-summary-card"><span>Status pembacaan</span><strong>{readings.filter((item) => item.freshness === "fresh").length} fresh</strong></div>
        </div>
      )}
      <div className="silo-card-grid">
        {readings.map((reading) => (
          <article className="silo-card" key={`${reading.device_id}:${reading.tag}`}>
            <div className="silo-card-heading">
              <h2>{reading.display_name || reading.tag}</h2>
              <span className={`silo-badge ${reading.freshness}`}>{reading.freshness}</span>
            </div>
            <p className="silo-muted">{reading.device_id} / {reading.tag}</p>
            <strong className="silo-capacity">
              {reading.capacity_pct === null ? "Unavailable" : `${reading.capacity_pct.toFixed(1)}%`}
            </strong>
            <p>Level: {reading.level_mm === null ? "Unavailable" : `${reading.level_mm.toFixed(1)} mm (${reading.level_m?.toFixed(2)} m)`}</p>
            <div className="silo-affected-equipment">
              <span className="silo-muted">Equipment terdampak</span>
              {reading.equipment.map((item) => (
                <span key={item.id}>{item.asset_id} - {item.name}</span>
              ))}
            </div>
            <p>Status sensor: {reading.sensor_status || "Unavailable"}</p>
            <p className="silo-muted">Last updated: {formatTime(reading.source_created_at)}</p>
            {reading.error && <p className="form-error">{reading.error}</p>}
          </article>
        ))}
        {!readings.length && sourceStatus?.connected && (
          <div className="silo-empty-state">
            <strong>Belum ada silo dependency</strong>
            <span>Pilih sensor dari database ExecuSys lalu hubungkan dengan satu atau beberapa equipment CMMS.</span>
          </div>
        )}
      </div>
      {isAdmin && (
        <MappingAdmin
          sensors={sensors}
          mappings={mappings}
          equipment={equipment}
          onChanged={() => void load()}
        />
      )}
    </section>
  );
}

function MappingAdmin({
  sensors,
  mappings,
  equipment,
  onChanged,
}: {
  sensors: SiloSensor[];
  mappings: SiloMapping[];
  equipment: Equipment[];
  onChanged: () => void;
}) {
  const [sensorKey, setSensorKey] = useState("");
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pickerResetKey, setPickerResetKey] = useState(0);
  const groupedMappings = Array.from(
    mappings.reduce((groups, mapping) => {
      const key = `${mapping.device_id}\u0000${mapping.tag}`;
      const group = groups.get(key) || { ...mapping, equipment_ids: [] as string[] };
      group.equipment_ids.push(mapping.equipment_id);
      groups.set(key, group);
      return groups;
    }, new Map<string, SiloMapping & { equipment_ids: string[] }>())
      .values(),
  );

  async function save() {
    const [device_id, tag] = sensorKey.split("\u0000");
    if (!device_id || !tag || !equipmentIds.length) {
      setError("Sensor dan minimal satu equipment wajib dipilih.");
      return;
    }
    try {
      if (editingId) {
        await updateSiloMapping(editingId, { equipment_ids: equipmentIds, enabled: true, display_name: displayName || undefined });
      } else {
        await createSiloMapping({ device_id, tag, equipment_ids: equipmentIds, enabled: true, display_name: displayName || undefined });
      }
      setSensorKey("");
      setEquipmentIds([]);
      setDisplayName("");
      setEditingId(null);
      setError("");
      setPickerResetKey((key) => key + 1);
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Mapping gagal disimpan");
    }
  }

  async function remove(deviceId: string, tag: string) {
    if (!window.confirm("Hapus dependency silo ini? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      await deleteSiloDependency(deviceId, tag);
      onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Mapping gagal dihapus");
    }
  }

  function edit(group: SiloMapping & { equipment_ids: string[] }) {
    setEditingId(group.id);
    setSensorKey(`${group.device_id}\u0000${group.tag}`);
    setEquipmentIds(group.equipment_ids);
    setDisplayName(group.display_name || "");
    setError("");
    setPickerResetKey((key) => key + 1);
  }

  function cancelEdit() {
    setEditingId(null);
    setSensorKey("");
    setEquipmentIds([]);
    setDisplayName("");
    setError("");
    setPickerResetKey((key) => key + 1);
  }

  return (
    <section className="silo-mapping-panel">
      <div className="silo-panel-heading">
        <div>
          <span className="silo-section-kicker">CONFIGURATION</span>
          <h2>Silo Dependency</h2>
        </div>
        <span className="silo-count-badge">{groupedMappings.length} silo terhubung</span>
      </div>
      <p className="silo-muted">Satu sensor silo dapat memengaruhi beberapa equipment sekaligus.</p>
      <div className="silo-mapping-form">
        <SearchablePicker
          key={`sensor-${pickerResetKey}`}
          label="Sensor silo"
          placeholder="Cari device atau tag..."
          value={sensorKey}
          options={sensors.filter((sensor) => !sensor.has_mapping || sensorKey === `${sensor.device_id}\u0000${sensor.tag}`).map((sensor) => ({
            value: `${sensor.device_id}\u0000${sensor.tag}`,
            label: `${sensor.device_id} / ${sensor.tag}`,
          }))}
          onChange={setSensorKey}
        />
        <MultiSearchablePicker
          key={`equipment-${pickerResetKey}`}
          label="Equipment CMMS"
          placeholder="Cari asset atau nama equipment..."
          values={equipmentIds}
          options={equipment.map((item) => ({ value: item.id, label: `${item.asset_id} - ${item.name}` }))}
          onChange={setEquipmentIds}
        />
        <label className="silo-field">
          <span>Display name <em>optional</em></span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Contoh: Silo Kayu 01" />
        </label>
        <div className="silo-form-actions">
          <button className="silo-primary-button" type="button" onClick={() => void save()}>{editingId ? "Simpan perubahan" : "Tambah dependency"}</button>
          {editingId && <button className="delete-history-button" type="button" onClick={cancelEdit}>Batal</button>}
        </div>
      </div>
      {error && <p role="alert" className="form-error">{error}</p>}
      <ul className="silo-mapping-list">
        {groupedMappings.map((mapping) => (
          <li key={`${mapping.device_id}:${mapping.tag}`}>
            <div>
              <strong>{mapping.display_name || mapping.tag}</strong>
              <span>{mapping.device_id} / {mapping.tag}</span>
              <small>{mapping.equipment_ids.length} equipment terdampak</small>
            </div>
            <div className="silo-list-actions">
              <button type="button" className="silo-edit-button" onClick={() => edit(mapping)}>Edit</button>
              <button type="button" className="delete-history-button" onClick={() => void remove(mapping.device_id, mapping.tag)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MultiSearchablePicker({
  label,
  placeholder,
  values,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  values: string[];
  options: { value: string; label: string }[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useCloseOnOutsideClick<HTMLLabelElement>(open, setOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = options.filter((option) => values.includes(option.value));
  const filtered = options.filter((option) =>
    !values.includes(option.value) && option.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <label className="silo-field silo-picker" ref={pickerRef}>
      <span>{label}</span>
      <div className="silo-multi-picker-input" onClick={() => { setOpen(true); inputRef.current?.focus(); }}>
        {selected.map((option) => (
          <button
            type="button"
            className="silo-selected-chip"
            key={option.value}
            onClick={(event) => {
              event.stopPropagation();
              onChange(values.filter((value) => value !== option.value));
            }}
          >
            {option.label} <span aria-hidden="true">×</span>
          </button>
        ))}
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${label}-options`}
          value={query}
          placeholder={selected.length ? "Tambah equipment..." : placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
        />
      </div>
      {open && (
        <div className="silo-picker-options" id={`${label}-options`} role="listbox">
          {filtered.length ? filtered.map((option) => (
            <button
              type="button"
              role="option"
              key={option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { onChange([...values, option.value]); setQuery(""); }}
            >
              {option.label}
            </button>
          )) : <span className="silo-picker-empty">Tidak ada equipment lain</span>}
        </div>
      )}
    </label>
  );
}

function SearchablePicker({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const pickerRef = useCloseOnOutsideClick<HTMLLabelElement>(open, setOpen);
  const selected = options.find((option) => option.value === value);
  const filtered = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())).slice(0, 30);

  return (
    <label className="silo-field silo-picker" ref={pickerRef}>
      <span>{label}</span>
      <input
        role="combobox"
        aria-expanded={open}
        aria-controls={`${label}-options`}
        value={selected && !open ? selected.label : query}
        placeholder={selected ? selected.label : placeholder}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); onChange(""); }}
        onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
      />
      {open && (
        <div className="silo-picker-options" id={`${label}-options`} role="listbox">
          {filtered.length ? filtered.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => { onChange(option.value); setQuery(""); setOpen(false); }}
            >
              {option.label}
            </button>
          )) : <span className="silo-picker-empty">Tidak ada hasil</span>}
        </div>
      )}
    </label>
  );
}

function useCloseOnOutsideClick<T extends HTMLElement>(
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  const pickerRef = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, setOpen]);

  return pickerRef;
}
