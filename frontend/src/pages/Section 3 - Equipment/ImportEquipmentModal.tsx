import React, { useRef, useState } from "react";
import { apiRequest, downloadApiFile, type EquipmentImportSummary } from "../../utils/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ImportEquipmentModal({ isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [result, setResult] = useState<EquipmentImportSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  function resetState() {
    setFile(null);
    setIsDragging(false);
    setIsUploading(false);
    setResult(null);
    setErrorMessage(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function handleFileSelect(selectedFile: File) {
    if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xlsm")) {
      setErrorMessage("File harus berformat Excel (.xlsx)");
      return;
    }
    setFile(selectedFile);
    setErrorMessage(null);
    setResult(null);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  async function handleDownloadTemplate() {
    try {
      setIsDownloadingTemplate(true);
      await downloadApiFile("/equipment/import-template", "template_import_equipment.xlsx");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengunduh template");
    } finally {
      setIsDownloadingTemplate(false);
    }
  }

  async function handleUpload() {
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setResult(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await apiRequest<EquipmentImportSummary>("/equipment/import-excel", {
        method: "POST",
        body: formData,
      });

      setResult(res);
      onSuccess(); // reload equipment list
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Gagal mengimpor file Excel");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>📊</span>
            <h2>Import Equipment & Komponen</h2>
          </div>
          <button type="button" className="modal-close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        {/* Template Download Box */}
        <div className="import-template-box">
          <div className="import-template-info">
            <h3>Download Template Excel</h3>
            <p>Gunakan template resmi untuk memastikan format kolom dan sheet sesuai standar.</p>
          </div>
          <button
            type="button"
            className="template-download-btn"
            onClick={() => void handleDownloadTemplate()}
            disabled={isDownloadingTemplate}
          >
            {isDownloadingTemplate ? "Mengunduh..." : "📥 Download Template"}
          </button>
        </div>

        {/* Drag and Drop Zone */}
        {!result && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".xlsx,.xlsm"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {!file ? (
              <div
                className={`import-dropzone ${isDragging ? "dragover" : ""}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="dropzone-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="dropzone-text">
                  Tarik file Excel ke sini atau <strong>Klik untuk memilih file</strong>
                </p>
                <p className="dropzone-hint">Format yang didukung: .xlsx (Maksimal 10MB)</p>
              </div>
            ) : (
              <div className="selected-file-card">
                <div className="file-details">
                  <span style={{ fontSize: "24px" }}>📄</span>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-file-btn"
                  title="Ganti File"
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* Error message display */}
        {errorMessage && <p className="login-error">{errorMessage}</p>}

        {/* Import Result Summary Card */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "14px", borderRadius: "10px", color: "#166534" }}>
              <div style={{ fontWeight: 700, fontSize: "14px" }}>✅ Import Selesai Berhasil!</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                Data telah berhasil diproses dan disimpan ke database sistem.
              </div>
            </div>

            <div className="import-stats-grid">
              <div className="import-stat-card created">
                <span className="stat-value">{result.total_equipment_created}</span>
                <span className="stat-label">Mesin Baru</span>
              </div>
              <div className="import-stat-card updated">
                <span className="stat-value">{result.total_equipment_updated}</span>
                <span className="stat-label">Mesin Diupdate</span>
              </div>
              <div className="import-stat-card components">
                <span className="stat-value">{result.total_components_added}</span>
                <span className="stat-label">Komponen Baru</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="import-errors-box">
                <h4>Catatan / Peringatan Baris:</h4>
                <ul>
                  {result.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="modal-actions">
          {result ? (
            <button type="button" className="primary-button" onClick={handleClose}>
              Selesai
            </button>
          ) : (
            <>
              <button type="button" className="secondary-button" onClick={handleClose} disabled={isUploading}>
                Batal
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => void handleUpload()}
                disabled={!file || isUploading}
              >
                {isUploading ? "Memproses Data..." : "🚀 Mulai Import Data"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
