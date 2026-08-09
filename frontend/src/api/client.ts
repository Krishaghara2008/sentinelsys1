import type {
  AnalysisResult,
  HealthCheck,
  HistoryEntry,
  RuleCatalogEntry,
  TelemetryInput,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Can't reach the SentinelSys API. Check that the backend is running and VITE_API_URL is correct."
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      /* ignore parse failure */
    }
    throw new ApiError(detail, res.status);
  }

  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<HealthCheck>("/api/health"),

  analyze: (telemetry: TelemetryInput) =>
    request<AnalysisResult>("/api/analyze", {
      method: "POST",
      body: JSON.stringify(telemetry),
    }),

  rules: () => request<{ rules: RuleCatalogEntry[]; total: number }>("/api/rules"),

  history: (limit = 50, offset = 0) =>
    request<{ analyses: HistoryEntry[] }>(`/api/history?limit=${limit}&offset=${offset}`),

  analysis: (id: number) => request<AnalysisResult>(`/api/analysis/${id}`),
};
