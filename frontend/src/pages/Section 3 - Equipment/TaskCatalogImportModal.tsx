import { useRef, useState } from "react";
import { apiRequest, type TaskCatalogImportSummary } from "../../utils/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskCatalogImportModal({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<TaskCatalogImportSummary | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const close = () => {
    setFile(null);
    setResult(null);
    setError("");
    onClose();
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      setResult(await apiRequest<TaskCatalogImportSummary>("/equipment/task-catalog/import", {
        method: "POST",
        body,
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Import task list gagal.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="import-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>Import Task List Equipment</h2>
          <button type="button" className="modal-close-button" onClick={close}>×</button>
        </div>
        <p style={{ fontSize: "12px", color: "#5C5954" }}>
          File Excel wajib memiliki header <strong>Asset ID</strong> dan <strong>Task List</strong>.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xlsm"
          style={{ display: "none" }}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <button type="button" className="secondary-button" onClick={() => inputRef.current?.click()}>
          {file ? file.name : "Pilih file Excel"}
        </button>
        {error && <p className="login-error">{error}</p>}
        {result && (
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            <strong>{result.total_created} task berhasil diimport.</strong>
            {result.errors.length > 0 && (
              <ul>{result.errors.map((item) => <li key={item}>{item}</li>)}</ul>
            )}
          </div>
        )}
        <div className="modal-actions" style={{ marginTop: "18px" }}>
          <button type="button" className="secondary-button" onClick={close}>Tutup</button>
          <button type="button" className="primary-button" disabled={!file || uploading} onClick={() => void upload()}>
            {uploading ? "Mengimport..." : "Import Task List"}
          </button>
        </div>
      </div>
    </div>
  );
}
