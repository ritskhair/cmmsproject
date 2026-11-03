import { useEffect, useRef, useState } from "react";

type RefreshLoader = () => Promise<void>;

type AutoRefreshOptions = {
  enabled?: boolean;
  intervalMs?: number;
  runImmediately?: boolean;
};

export function useAutoRefresh(
  load: RefreshLoader,
  { enabled = true, intervalMs = 5000, runImmediately = false }: AutoRefreshOptions = {},
) {
  const loadRef = useRef(load);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    let requestInFlight = false;

    const refresh = async () => {
      if (!active || document.visibilityState !== "visible" || requestInFlight) return;
      requestInFlight = true;
      setIsRefreshing(true);
      try {
        await loadRef.current();
        if (active) setLastUpdated(new Date());
      } finally {
        requestInFlight = false;
        if (active) setIsRefreshing(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    if (runImmediately) void refresh();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const timer = window.setInterval(() => void refresh(), intervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs, runImmediately]);

  return { lastUpdated, isRefreshing };
}
