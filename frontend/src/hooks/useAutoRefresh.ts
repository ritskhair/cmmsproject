import { useCallback, useEffect, useRef, useState } from "react";

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
  const inFlightRef = useRef(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const refreshNow = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsRefreshing(true);
    try {
      await loadRef.current();
      setLastUpdated(new Date());
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      inFlightRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let active = true;

    const refreshIfVisible = async () => {
      if (!active || document.visibilityState !== "visible" || inFlightRef.current) return;
      inFlightRef.current = true;
      setIsRefreshing(true);
      try {
        await loadRef.current();
        if (active) {
          setLastUpdated(new Date());
          setHasError(false);
        }
      } catch {
        if (active) setHasError(true);
      } finally {
        inFlightRef.current = false;
        if (active) setIsRefreshing(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshIfVisible();
    };

    if (runImmediately) void refreshIfVisible();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const timer = window.setInterval(() => void refreshIfVisible(), intervalMs);

    return () => {
      active = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, intervalMs, runImmediately]);

  return { lastUpdated, isRefreshing, hasError, refreshNow };
}
