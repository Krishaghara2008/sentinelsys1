import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, History as HistoryIcon, Search } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import ApiErrorBanner from "../components/ApiErrorBanner";
import { api, ApiError } from "../api/client";
import type { HistoryEntry } from "../types";
import { formatTimestamp, riskTextClass } from "../lib/theme";
import { useAnalysis } from "../context/AnalysisContext";

type SortKey = "timestamp" | "maintenance_priority";

export default function History() {
  const { historyVersion } = useAnalysis();
  const [entries, setEntries] = useState<HistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("timestamp");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .history(100)
      .then((res) => {
        if (!cancelled) setEntries(res.analyses);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : "Couldn't load analysis history.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [historyVersion]);

  const riskOptions = useMemo(() => {
    if (!entries) return ["All"];
    return ["All", ...Array.from(new Set(entries.map((e) => e.risk_level)))];
  }, [entries]);

  const rows = useMemo(() => {
    if (!entries) return [];
    let filtered = entries;
    if (riskFilter !== "All") {
      filtered = filtered.filter((e) => e.risk_level === riskFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.status.toLowerCase().includes(q) ||
          e.risk_level.toLowerCase().includes(q) ||
          String(e.id).includes(q)
      );
    }
    return [...filtered].sort((a, b) => {
      const dir = sortDesc ? -1 : 1;
      if (sortKey === "timestamp") {
        return dir * (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
      return dir * (a.maintenance_priority - b.maintenance_priority);
    });
  }, [entries, riskFilter, search, sortKey, sortDesc]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">Analysis History</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Every reading sent through the fuzzy engine, persisted by the FastAPI backend.
        </p>
      </div>

      {error && <ApiErrorBanner message={error} />}

      <Card>
        <div className="flex flex-col gap-3 border-b border-line-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search status, risk, or id…"
              className="w-full rounded-lg border border-line bg-panel-raised py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-cyan/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="rounded-lg border border-line bg-panel-raised px-3 py-2 text-xs text-ink"
            >
              {riskOptions.map((r) => (
                <option key={r} value={r}>
                  {r === "All" ? "All risk levels" : r}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortKey("timestamp")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                sortKey === "timestamp"
                  ? "border-cyan/40 text-cyan"
                  : "border-line text-ink-muted"
              }`}
            >
              Time
            </button>
            <button
              onClick={() => setSortKey("maintenance_priority")}
              className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                sortKey === "maintenance_priority"
                  ? "border-cyan/40 text-cyan"
                  : "border-line text-ink-muted"
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setSortDesc((d) => !d)}
              className="flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink"
            >
              <ArrowDownUp size={13} />
              {sortDesc ? "Desc" : "Asc"}
            </button>
          </div>
        </div>

        {!entries ? (
          <EmptyState icon={HistoryIcon} title="Loading history…" description="" />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title="No analyses yet"
            description="Run a few analyses from the Dashboard and they'll show up here, ready to search and sort."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line-soft text-[11px] uppercase tracking-wider text-ink-faint">
                  <th className="px-5 py-3 font-medium">Timestamp</th>
                  <th className="px-5 py-3 font-medium">CPU °C</th>
                  <th className="px-5 py-3 font-medium">CPU %</th>
                  <th className="px-5 py-3 font-medium">RAM %</th>
                  <th className="px-5 py-3 font-medium">Disk %</th>
                  <th className="px-5 py-3 font-medium">Fan RPM</th>
                  <th className="px-5 py-3 font-medium">Uptime</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-panel-raised/60">
                    <td className="px-5 py-3 font-mono text-xs tabular text-ink-muted">
                      {formatTimestamp(e.timestamp)}
                    </td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.cpu_temperature}</td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.cpu_usage}</td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.ram_usage}</td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.disk_usage}</td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.fan_speed}</td>
                    <td className="px-5 py-3 font-mono tabular">{e.telemetry.uptime}d</td>
                    <td className="px-5 py-3 font-mono font-semibold tabular text-ink">
                      {e.maintenance_priority}
                    </td>
                    <td className={`px-5 py-3 font-medium ${riskTextClass(e.risk_level)}`}>
                      {e.risk_level}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
