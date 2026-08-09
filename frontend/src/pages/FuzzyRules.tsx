import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, Waves } from "lucide-react";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import { useAnalysis } from "../context/AnalysisContext";
import { api, ApiError } from "../api/client";
import type { RuleCatalogEntry } from "../types";
import { CONSEQUENT_COLOR } from "../lib/theme";
import ApiErrorBanner from "../components/ApiErrorBanner";

type Filter = "All" | "Fired" | "Not Fired";

export default function FuzzyRules() {
  const { result } = useAnalysis();
  const [catalog, setCatalog] = useState<RuleCatalogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    let cancelled = false;
    api
      .rules()
      .then((res) => {
        if (!cancelled) setCatalog(res.rules);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof ApiError ? e.message : "Couldn't load the rule catalog.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const firingByNumber = useMemo(() => {
    const map = new Map<number, { firing_strength: number; fired: boolean }>();
    result?.fired_rules.forEach((r) =>
      map.set(r.rule_number, { firing_strength: r.firing_strength, fired: r.fired })
    );
    return map;
  }, [result]);

  const rows = useMemo(() => {
    if (!catalog) return [];
    return catalog
      .map((rule) => ({
        ...rule,
        ...(firingByNumber.get(rule.rule_number) ?? { firing_strength: 0, fired: false }),
      }))
      .filter((rule) => {
        if (filter === "Fired") return rule.fired;
        if (filter === "Not Fired") return !rule.fired;
        return true;
      });
  }, [catalog, firingByNumber, filter]);

  const firedTotal = catalog
    ? catalog.filter((r) => firingByNumber.get(r.rule_number)?.fired).length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Fuzzy Rule Inspector</h2>
          <p className="mt-1 text-sm text-ink-muted">
            All 30 rules from the SentinelSys fuzzy controller.
            {result && (
              <>
                {" "}
                <span className="text-cyan">{firedTotal}</span> fired against the current
                telemetry reading.
              </>
            )}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-line bg-panel p-1">
          {(["All", "Fired", "Not Fired"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? "bg-cyan/15 text-cyan"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && <ApiErrorBanner message={error} />}

      {!result && (
        <div className="rounded-lg border border-line-soft bg-panel-raised px-4 py-3 text-xs text-ink-faint">
          Run an analysis on the Dashboard to see live firing strengths — the catalog below still
          shows all 30 rules either way.
        </div>
      )}

      <Card>
        {!catalog ? (
          <EmptyState icon={Waves} title="Loading rule catalog…" description="" />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={Waves}
            title="No rules match this filter"
            description="Try switching back to All."
          />
        ) : (
          <div className="divide-y divide-line-soft">
            {rows.map((rule) => (
              <div
                key={rule.rule_number}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-cyan">
                      RULE {String(rule.rule_number).padStart(2, "0")}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide"
                      style={{
                        color: CONSEQUENT_COLOR[rule.consequent],
                        background: `${CONSEQUENT_COLOR[rule.consequent]}1A`,
                      }}
                    >
                      {rule.consequent}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink">{rule.description}</p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <div className="w-28">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(rule.firing_strength * 100)}%`,
                          background: CONSEQUENT_COLOR[rule.consequent],
                        }}
                      />
                    </div>
                    <p className="mt-1 text-right font-mono text-[11px] tabular text-ink-faint">
                      {rule.firing_strength.toFixed(2)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      rule.fired ? "text-healthy" : "text-ink-faint"
                    }`}
                  >
                    {rule.fired ? <CheckCircle2 size={15} /> : <CircleDashed size={15} />}
                    {rule.fired ? "Fired" : "Not Fired"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
