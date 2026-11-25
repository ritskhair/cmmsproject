type SyncStatusBarProps = {
  isRefreshing: boolean;
  lastUpdated: Date | null;
  hasError?: boolean;
  onRefresh?: () => void;
};

/**
 * Displays live data synchronization status and an optional manual refresh trigger.
 */
export default function SyncStatusBar({
  isRefreshing,
  lastUpdated,
  hasError = false,
  onRefresh,
}: SyncStatusBarProps) {
  const dotClass = isRefreshing
    ? "sync-status-dot syncing"
    : hasError
      ? "sync-status-dot error"
      : "sync-status-dot";

  const statusText = isRefreshing
    ? "Memperbarui data..."
    : hasError
      ? "Sinkronisasi terganggu"
      : lastUpdated
        ? `Live · Diperbarui ${lastUpdated.toLocaleTimeString()}`
        : "Memuat data...";

  return (
    <div className="sync-status-bar" role="status" aria-live="polite">
      <span className={dotClass} aria-hidden="true" />
      <span>{statusText}</span>
      {onRefresh && (
        <button
          type="button"
          className="sync-refresh-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Muat ulang data"
        >
          <svg
            className={`sync-refresh-icon${isRefreshing ? " spinning" : ""}`}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-2.64-6.36" />
            <path d="M21 3v6h-6" />
          </svg>
          Refresh
        </button>
      )}
    </div>
  );
}
