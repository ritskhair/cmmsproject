import { useCallback, useEffect, useRef, useState } from "react";

import { apiRequest, type Equipment, type EwoRequest } from "../utils/api";
import { useAutoRefresh } from "../hooks/useAutoRefresh";

type EwoNotification = {
  ewo: EwoRequest;
  equipmentName: string;
};

function EmergencyIcon() {
  return (
    <svg className="ewo-notification-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 3 9 17H3L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

export default function EwoNotificationStack() {
  const [notifications, setNotifications] = useState<EwoNotification[]>([]);
  const knownIdsRef = useRef<Set<string> | null>(null);
  const timersRef = useRef(new Map<string, number>());

  const dismiss = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((current) => current.filter(({ ewo }) => ewo.id !== id));
  }, []);

  const loadNotifications = useCallback(async () => {
    const [ewos, equipment] = await Promise.all([
      apiRequest<EwoRequest[]>("/ewo-requests"),
      apiRequest<Equipment[]>("/equipment"),
    ]);
    const knownIds = knownIdsRef.current;
    const pending = ewos.filter((ewo) => ewo.status === "pending");

    if (!knownIds) {
      knownIdsRef.current = new Set(ewos.map((ewo) => ewo.id));
      return;
    }

    const equipmentNames = new Map(equipment.map((item) => [item.id, item.name]));
    const newNotifications = pending
      .filter((ewo) => !knownIds.has(ewo.id))
      .map((ewo) => ({
        ewo,
        equipmentName: equipmentNames.get(ewo.equipment_id) ?? ewo.equipment_id,
      }));

    newNotifications.forEach(({ ewo }) => {
      const timer = window.setTimeout(() => dismiss(ewo.id), 5000);
      timersRef.current.set(ewo.id, timer);
    });

    if (newNotifications.length) {
      setNotifications((current) => [...current, ...newNotifications]);
    }
    ewos.forEach((ewo) => knownIds.add(ewo.id));
  }, [dismiss]);

  useAutoRefresh(loadNotifications, { runImmediately: true });

  useEffect(() => () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <div className="ewo-notification-stack" aria-live="polite" aria-label="Notifikasi EWO">
      {notifications.map(({ ewo, equipmentName }) => (
        <article className="ewo-notification" key={ewo.id}>
          <div className="ewo-notification-icon-wrap">
            <EmergencyIcon />
          </div>
          <div className="ewo-notification-content">
            <strong>EWO Baru Masuk</strong>
            <span>{ewo.ewo_number} · Section {ewo.section}</span>
            <span>{equipmentName}</span>
          </div>
          <button
            type="button"
            className="ewo-notification-close"
            onClick={() => dismiss(ewo.id)}
            aria-label={`Tutup notifikasi ${ewo.ewo_number}`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" />
            </svg>
          </button>
        </article>
      ))}
    </div>
  );
}
