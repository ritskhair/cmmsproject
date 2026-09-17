import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router-dom";
import { apiRequest, type Equipment } from "../../utils/api";

export default function OperatorEwoForm() {
  const navigate = useNavigate();

  const [requestor, setRequestor] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState<"1" | "2" | "3" | "4" | "5">("1");
  const [equipmentId, setEquipmentId] = useState("");
  const [equipmentOptions, setEquipmentOptions] = useState<Equipment[]>([]);
  const [teamLeader, setTeamLeader] = useState("");
  const [shift, setShift] = useState("");
  const [failureType, setFailureType] = useState("");
  const [taskList, setTaskList] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  useEffect(() => {
    let active = true;
    setLoadingEquipment(true);
    setEquipmentId("");
    apiRequest<Equipment[]>(`/equipment/operator/equipment?section=${section}`)
      .then((equipment) => {
        if (active) setEquipmentOptions(equipment);
      })
      .catch((requestError) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Equipment gagal dimuat.");
      })
      .finally(() => {
        if (active) setLoadingEquipment(false);
      });
    return () => {
      active = false;
    };
  }, [section]);

  const handleSectionChange = (
    nextSection: string,
  ) => {
    if (!/^[1-5]$/.test(nextSection)) return;
    setSection(nextSection as "1" | "2" | "3" | "4" | "5");
    setEquipmentId("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !requestor ||
      !department ||
      !section ||
      !equipmentId ||
      !teamLeader ||
      !shift ||
      !failureType ||
      !taskList
    ) {
      setError(
        "Mohon lengkapi seluruh field wajib sebelum mengirim EWO.",
      );

      return;
    }

    try {
      await apiRequest("/ewo-requests", {
        method: "POST",
        body: JSON.stringify({
          section,
          requestor_name: requestor,
          department,
          equipment_id: equipmentId,
          shift,
          team_leader_name: teamLeader,
          failure_type: failureType === "Total" ? "total" : "partial",
          task_list: taskList,
          special_note: specialNote || null,
        }),
      });
      setError("");
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "EWO gagal dikirim.");
    }
  };

  if (submitted) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successIcon}>✓</div>

        <h1 style={styles.successTitle}>
          EWO Berhasil Dikirim
        </h1>

        <p style={styles.successText}>
          Emergency Work Order Anda telah dicatat
          dan menunggu pemeriksaan dari tim
          maintenance.
        </p>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={() => navigate("/login")}
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>
          ENGINEERING & MAINTENANCE
        </h1>

        <p style={styles.headerSubtitle}>
          Emergency Work Order System
        </p>
      </header>

      <main style={styles.container}>
        <section style={styles.titleCard}>
          <h1 style={styles.title}>
            Emergency Work Order (EWO)
          </h1>

          <p style={styles.description}>
            Gunakan formulir ini untuk melaporkan
            kondisi darurat atau kritis pada mesin
            yang membutuhkan penanganan segera.
            Tanda bintang (*) menunjukkan form wajib diisi. 
            Pastikan untuk mengisi seluruh form wajib sebelum mengirim EWO.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Identitas Requestor
            </h2>

            <label style={styles.label}>
              Nama Requestor *
            </label>

            <input
              value={requestor}
              onChange={(event) =>
                setRequestor(event.target.value)
              }
              placeholder="Masukkan nama requestor"
              style={styles.input}
            />

            <label style={styles.label}>
              Nama Department *
            </label>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              style={styles.input}
            >
              <option value="">
                Pilih department
              </option>

              <option value="Production & QC">
                Production & QC
              </option>

              <option value="PPIC">
                PPIC
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Informasi Equipment
            </h2>

            <label style={styles.label}>
              Section *
            </label>

            <select
              value={section}
              onChange={(event) =>
                handleSectionChange(
                  event.target.value,
                )
              }
              style={styles.input}
            >
              <option value="1">Section 1</option>
              <option value="2">Section 2</option>
              <option value="3">Section 3</option>
              <option value="4">Section 4</option>
              <option value="5">Section 5</option>
            </select>

            <label style={styles.label}>
              Mesin / Equipment *
            </label>

            <select
              value={equipmentId}
              onChange={(event) =>
                setEquipmentId(event.target.value)
              }
              style={styles.input}
            >
              <option value="">
                {loadingEquipment ? "Memuat equipment..." : "Pilih equipment"}
              </option>

              {equipmentOptions.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.asset_id} - {item.name}
                </option>
              ))}
            </select>
          </section>

          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>
              Detail Emergency Work Order
            </h2>

            <label style={styles.label}>
              Team Leader Produksi *
            </label>

            <input
              value={teamLeader}
              onChange={(event) =>
                setTeamLeader(event.target.value)
              }
              placeholder="Nama team leader"
              style={styles.input}
            />

            <label style={styles.label}>
              Shift *
            </label>

            <select
              value={shift}
              onChange={(event) =>
                setShift(event.target.value)
              }
              style={styles.input}
            >
              <option value="">
                Pilih shift
              </option>

              <option value="SHIFT 1">
                SHIFT 1
              </option>

              <option value="SHIFT 2">
                SHIFT 2
              </option>

              <option value="SHIFT 3">
                SHIFT 3
              </option>

              <option value="LONG SHIFT 1">
                LONG SHIFT 1
              </option>

              <option value="LONG SHIFT 2">
                LONG SHIFT 2
              </option>
            </select>

            <label style={styles.label}>
              Type of Failure *
            </label>

            <select
              value={failureType}
              onChange={(event) =>
                setFailureType(event.target.value)
              }
              style={styles.input}
            >
              <option value="">
                Pilih tipe kerusakan
              </option>

              <option value="Total">
                Total
              </option>

              <option value="Sebagian">
                Sebagian
              </option>
            </select>

            <label style={styles.label}>
              Task List *
            </label>

            <textarea
              value={taskList}
              onChange={(event) =>
                setTaskList(event.target.value)
              }
              placeholder="Jelaskan masalah atau pekerjaan yang diperlukan"
              rows={5}
              style={styles.textarea}
            />

            <label style={styles.label}>
              Special Note
            </label>

            <textarea
              value={specialNote}
              onChange={(event) =>
                setSpecialNote(event.target.value)
              }
              placeholder="Tambahkan catatan khusus atau safety issue"
              rows={4}
              style={styles.textarea}
            />
          </section>

          {error && (
            <p style={styles.error}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={styles.primaryButton}
          >
            Kirim EWO
          </button>
        </form>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f7f5",
    padding: "24px",
  },

  header: {
    background: "#153b78",
    color: "#ffffff",
    padding: "28px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  logo: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 42px)",
  },

  headerSubtitle: {
    marginBottom: 0,
    fontSize: "14px",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },

  titleCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    marginBottom: "16px",
  },

  title: {
    marginTop: 0,
    color: "#222222",
  },

  description: {
    lineHeight: 1.6,
    color: "#555555",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #dddddd",
  },

  sectionTitle: {
    marginTop: 0,
    color: "#751b17",
    fontSize: "20px",
  },

  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "8px",
    fontWeight: 600,
    color: "#333333",
  },

  input: {
    width: "100%",
    padding: "13px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "15px",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    border: "1px solid #cccccc",
    borderRadius: "6px",
    fontSize: "15px",
    resize: "vertical",
  },

  primaryButton: {
    border: "none",
    borderRadius: "6px",
    padding: "14px 22px",
    background: "#751b17",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  error: {
    color: "#b42318",
    background: "#fee4e2",
    padding: "12px",
    borderRadius: "6px",
  },

  successPage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "24px",
    background: "#ffffff",
  },

  successIcon: {
    width: "76px",
    height: "76px",
    borderRadius: "50%",
    background: "#e7f7ef",
    color: "#0ca678",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    marginBottom: "20px",
  },

  successTitle: {
    color: "#0ca678",
  },

  successText: {
    maxWidth: "420px",
    lineHeight: 1.6,
    color: "#555555",
  },
};