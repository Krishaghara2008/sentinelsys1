import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { api, ApiError } from "../api/client";
import type { AnalysisResult, TelemetryInput } from "../types";

export const DEFAULT_TELEMETRY: TelemetryInput = {
  cpu_temperature: 52,
  cpu_usage: 40,
  ram_usage: 55,
  disk_usage: 50,
  fan_speed: 2400,
  uptime: 7,
};

interface AnalysisContextValue {
  telemetry: TelemetryInput;
  setTelemetry: (t: TelemetryInput) => void;
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  runAnalysis: () => Promise<void>;
  historyVersion: number;
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [telemetry, setTelemetry] = useState<TelemetryInput>(DEFAULT_TELEMETRY);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyVersion, setHistoryVersion] = useState(0);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await api.analyze(telemetry);
      setResult(res);
      setHistoryVersion((v) => v + 1);
    } catch (e) {
      const message =
        e instanceof ApiError ? e.message : "Unexpected error reaching the fuzzy engine.";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [telemetry]);

  return (
    <AnalysisContext.Provider
      value={{ telemetry, setTelemetry, result, isAnalyzing, error, runAnalysis, historyVersion }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used within AnalysisProvider");
  return ctx;
}
