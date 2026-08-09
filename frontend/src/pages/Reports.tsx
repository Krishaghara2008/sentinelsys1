import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, FileText } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import ApiErrorBanner from "../components/ApiErrorBanner";
import StatTile from "../components/StatTile";
import { api, ApiError } from "../api/client";
import type { HistoryEntry } from "../types";
import { RISK_COLOR } from "../lib/theme";

export default function Reports() {
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .history(200)
      .then((res) => setEntries(res.analyses))
      .catch((e) =>
        setError(e instanceof ApiError ? e.message : "Couldn't load report data.")
      );
  }, []);

  const trend = useMemo(() => {
    if (!entries) return [];
    return [...entries]
      .reverse()
      .map((e) => ({
        label: `#${e.id}`,
        priority: e.maintenance_priority,
      }));
  }, [entries]);

  const distribution = useMemo(() => {
    if (!entries) return [];
    const counts = new Map<string, number>();
    entries.forEach((e) => counts.set(e.risk_level, (counts.get(e.risk_level) ?? 0) + 1));
    return Array.from(counts.entries()).map(([risk, count]) => ({ risk, count }));
  }, [entries]);

  const avgPriority = entries?.length
    ? (entries.reduce((s, e) => s + e.maintenance_priority, 0) / entries.length).toFixed(2)
    : "—";

  const criticalCount = entries?.filter((e) => e.risk_level === "Critical").length ?? 0;

  function exportCsv() {
    if (!entries || entries.length === 0) return;
    const header = [
      "id", "timestamp", "cpu_temperature", "cpu_usage", "ram_usage",
      "disk_usage", "fan_speed", "uptime", "maintenance_priority", "health_index", "risk_level", "status",
    ];
    const lines = entries.map((e) =>
      [
        e.id, e.timestamp, e.telemetry.cpu_temperature, e.telemetry.cpu_usage,
        e.telemetry.ram_usage, e.telemetry.disk_usage, e.telemetry.fan_speed,
        e.telemetry.uptime, e.maintenance_priority, e.health_index, e.risk_level, e.status,
      ].join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentinelsys-analyses.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Reports</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Aggregate view across every analysis stored in the backend.
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!entries || entries.length === 0}
          className="flex items-center gap-2 rounded-lg border border-line bg-panel-raised px-4 py-2 text-sm font-medium text-ink-muted transition hover:border-cyan/40 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {error && <ApiErrorBanner message={error} />}

      {!entries ? (
        <Card>
          <EmptyState icon={FileText} title="Loading report data…" description="" />
        </Card>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="Nothing to report yet"
            description="Run a few analyses from the Dashboard to populate trends and distributions here."
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Total Analyses" value={entries.length} />
            <StatTile label="Avg Priority" value={avgPriority} />
            <StatTile label="Critical Readings" value={criticalCount} valueClass="text-critical" />
            <StatTile
              label="Latest Priority"
              value={entries[0]?.maintenance_priority ?? "—"}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Maintenance Priority Trend" eyebrow="Over time">
              <div className="h-[260px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid stroke="#161D28" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "#8B96A5", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#8B96A5", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#0F141C",
                        border: "1px solid #1E2733",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="priority"
                      stroke="#2DD9E8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Risk Distribution" eyebrow="All analyses">
              <div className="flex h-[260px] items-center p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribution}
                      dataKey="count"
                      nameKey="risk"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {distribution.map((d, i) => (
                        <Cell key={i} fill={RISK_COLOR[d.risk] ?? "#2DD9E8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0F141C",
                        border: "1px solid #1E2733",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
