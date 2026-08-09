import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import StatTile from "../components/StatTile";
import { useAnalysis } from "../context/AnalysisContext";
import { CONSEQUENT_COLOR, RISK_COLOR, riskTextClass } from "../lib/theme";
import { ScanSearch } from "lucide-react";

const VARIABLE_LABELS: Record<string, string> = {
  cpu_temp: "CPU Temp",
  cpu_usage: "CPU Usage",
  ram_usage: "RAM Usage",
  disk_usage: "Disk Usage",
  fan_speed: "Fan Speed",
  uptime: "Uptime",
};

export default function SystemAnalysis() {
  const { result, telemetry } = useAnalysis();

  if (!result) {
    return (
      <Card>
        <EmptyState
          icon={ScanSearch}
          title="No analysis to inspect yet"
          description="Head to the Dashboard, set your telemetry values, and click Analyze System — this page fills in with the live fuzzy engine output."
        />
      </Card>
    );
  }

  const radarData = Object.entries(result.membership_degrees).map(([variable, degrees]) => ({
    variable: VARIABLE_LABELS[variable] ?? variable,
    severity: Math.round(Math.max(...Object.values(degrees)) * 100),
  }));

  const topRules = [...result.fired_rules]
    .sort((a, b) => b.firing_strength - a.firing_strength)
    .slice(0, 10)
    .map((r) => ({
      name: `R${r.rule_number}`,
      strength: Math.round(r.firing_strength * 100),
      consequent: r.consequent,
    }));

  const firedCount = result.fired_rules.filter((r) => r.fired).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">System Analysis</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Full breakdown of the most recent fuzzy engine run.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Maintenance Priority" value={result.maintenance_priority} />
        <StatTile label="Health Index" value={`${result.health_index}%`} />
        <StatTile
          label="Risk Level"
          value={result.risk_level}
          valueClass={riskTextClass(result.risk_level)}
        />
        <StatTile label="Rules Fired" value={`${firedCount} / ${result.fired_rules.length}`} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Current Telemetry" eyebrow="Snapshot">
          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
            <StatTile label="CPU Temp" value={`${telemetry.cpu_temperature}°C`} />
            <StatTile label="CPU Usage" value={`${telemetry.cpu_usage}%`} />
            <StatTile label="RAM Usage" value={`${telemetry.ram_usage}%`} />
            <StatTile label="Disk Usage" value={`${telemetry.disk_usage}%`} />
            <StatTile label="Fan Speed" value={`${telemetry.fan_speed}`} sub="RPM" />
            <StatTile label="Uptime" value={`${telemetry.uptime}`} sub="days" />
          </div>
        </Card>

        <Card title="Membership Severity" eyebrow="Radar">
          <div className="h-[260px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#1E2733" />
                <PolarAngleAxis
                  dataKey="variable"
                  tick={{ fill: "#8B96A5", fontSize: 11 }}
                />
                <Radar
                  dataKey="severity"
                  stroke="#2DD9E8"
                  fill="#2DD9E8"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0F141C",
                    border: "1px solid #1E2733",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v) => [`${v}%`, "Max membership"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Top Firing Rules" eyebrow="Firing strength">
        <div className="h-[280px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRules} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid stroke="#161D28" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#8B96A5", fontSize: 11 }} />
              <YAxis tick={{ fill: "#8B96A5", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#0F141C",
                  border: "1px solid #1E2733",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v, _n, item) => [
                  `${v}% — ${item.payload.consequent}`,
                  "Firing strength",
                ]}
              />
              <Bar dataKey="strength" radius={[4, 4, 0, 0]}>
                {topRules.map((r, i) => (
                  <Cell key={i} fill={CONSEQUENT_COLOR[r.consequent] ?? "#2DD9E8"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card
        title="Recommendation"
        eyebrow="From fuzzy result"
        className={`border-l-2`}
        style={{ borderLeftColor: RISK_COLOR[result.risk_level] } as React.CSSProperties}
      >
        <div className="p-5">
          <p className={`text-lg font-semibold ${riskTextClass(result.risk_level)}`}>
            {result.recommendation}
          </p>
        </div>
      </Card>
    </div>
  );
}
