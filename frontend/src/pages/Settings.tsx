import { useState } from "react";
import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import Card from "../components/Card";
import { useConnection } from "../context/ConnectionContext";
import { api, ApiError } from "../api/client";

export default function Settings() {
  const { connected, health } = useConnection();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.health();
      setTestResult(`Connected — ${res.rules_loaded} rules loaded, engine ${res.fuzzy_engine}.`);
    } catch (e) {
      setTestResult(e instanceof ApiError ? e.message : "Connection failed.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Settings</h2>
        <p className="mt-1 text-sm text-ink-muted">Backend connection and environment.</p>
      </div>

      <Card title="API Connection" eyebrow="Backend">
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink">API URL</p>
              <p className="font-mono text-xs text-ink-faint">{apiUrl}</p>
            </div>
            <div
              className={`flex items-center gap-1.5 text-xs font-medium ${
                connected ? "text-healthy" : "text-critical"
              }`}
            >
              {connected ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              {connected ? "Connected" : "Disconnected"}
            </div>
          </div>

          <p className="rounded-lg border border-line-soft bg-panel-raised px-3 py-2.5 text-xs text-ink-faint">
            To point the dashboard at a different backend, set{" "}
            <code className="text-cyan">VITE_API_URL</code> in{" "}
            <code className="text-cyan">frontend/.env</code> and restart{" "}
            <code className="text-cyan">npm run dev</code>.
          </p>

          {health && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-line-soft bg-panel-raised px-3 py-2">
                <p className="text-ink-faint">Fuzzy Engine</p>
                <p className="mt-0.5 text-ink">{health.fuzzy_engine}</p>
              </div>
              <div className="rounded-lg border border-line-soft bg-panel-raised px-3 py-2">
                <p className="text-ink-faint">Rules Loaded</p>
                <p className="mt-0.5 text-ink">{health.rules_loaded}</p>
              </div>
            </div>
          )}

          <button
            onClick={testConnection}
            disabled={testing}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel-raised px-4 py-2 text-sm font-medium text-ink-muted transition hover:border-cyan/40 hover:text-cyan disabled:opacity-60"
          >
            <RefreshCcw size={14} className={testing ? "animate-spin" : ""} />
            Test connection
          </button>
          {testResult && <p className="text-xs text-ink-muted">{testResult}</p>}
        </div>
      </Card>

      <Card title="About This Build" eyebrow="Version">
        <div className="space-y-1.5 p-5 text-sm text-ink-muted">
          <p>SentinelSys dashboard — React + Vite frontend, FastAPI + skfuzzy backend.</p>
          <p>All fuzzy calculations run in Python; the frontend only renders API results.</p>
        </div>
      </Card>
    </div>
  );
}
