const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("X-Session-Token", token);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      "Backend belum berjalan. Jalankan server FastAPI di port 8000 lalu coba lagi.",
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
  status: "Operational" | "Warning" | "Critical";
  last_pm: string | null;
  created_at: string;
};
