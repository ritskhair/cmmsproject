// The Docker deployment proxies /api to the backend, keeping browser requests
// on the same origin as the frontend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = sessionStorage.getItem("cmmsSessionToken");
  const headers = new Headers(options.headers);

  // Do not set Content-Type if body is FormData (browser will set boundary automatically)
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("X-Session-Token", token);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (requestError) {
    const reason = requestError instanceof TypeError
      ? "Periksa alamat API, CORS, dan firewall."
      : requestError instanceof Error
        ? requestError.message
        : "Periksa alamat API, CORS, dan firewall.";
    throw new ApiError(
      0,
      `Backend tidak dapat dihubungi di ${API_BASE_URL}. ${reason}`,
    );
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      message = body.detail || message;
    } catch {
      // Keep the HTTP status message when the response is not JSON.
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export type OperatorLoginResponse = {
  token: string;
  role: "operator";
};

export type AccountLoginResponse = {
  token: string;
  role: string;
  account: {
    id: string;
    username: string;
    role: string;
    created_at: string;
  };
};

export type Equipment = {
  id: string;
  asset_id: string;
  name: string;
  type: string;
  section: "1" | "2" | "3" | "4" | "5";
  section_id: string | null;
  status: "Operational" | "Warning" | "Critical";
  last_pm: string | null;
  created_at: string;
};

export type Section = {
  id: string;
  code: string;
  name: string;
  active: boolean;
};

export type Component = {
  id: string;
  asset_id: string | null;
  name: string;
  type: string;
  status: Equipment["status"];
  machine_id: string;
  created_at: string;
};

export type FailureBySection = {
  section: string;
  total: number;
  percentage: number;
  cumulative_percentage: number;
};

export type EquipmentStatusCount = {
  operational: number;
  warning: number;
  critical: number;
};

export type DashboardSummary = {
  mttr_minutes: number | null;
  total_failures: number;
  open_work_orders: number;
  equipment_status: EquipmentStatusCount;
  failure_by_section: FailureBySection[];
};

export async function fetchDashboardSummary(
  dateFrom: string,
  dateTo: string,
  section?: string,
): Promise<DashboardSummary> {
  const params = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
  if (section) params.set("section", section);
  return apiRequest<DashboardSummary>(`/dashboard/summary?${params.toString()}`);
}

export type EquipmentImportSummary = {
  success: boolean;
  total_equipment_created: number;
  total_equipment_updated: number;
  total_components_added: number;
  errors: string[];
};

export async function downloadApiFile(path: string, defaultFilename = "download.xlsx"): Promise<void> {
  const token = sessionStorage.getItem("cmmsSessionToken");
  const headers = new Headers();
  if (token) {
    headers.set("X-Session-Token", token);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (!response.ok) {
    let message = `Gagal mengunduh file (status ${response.status})`;
    try {
      const err = (await response.json()) as { detail?: string };
      if (err.detail) message = err.detail;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = defaultFilename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
