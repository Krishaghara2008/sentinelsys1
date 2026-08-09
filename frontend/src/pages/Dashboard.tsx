import {
  Clock,
  Cpu,
  Fan,
  HardDrive,
  Loader2,
  MemoryStick,
  ScanLine,
  Thermometer,
} from "lucide-react";
import Card from "../components/Card";
import ApiErrorBanner from "../components/ApiErrorBanner";
import TelemetrySlider from "../components/TelemetrySlider";
import PriorityDial from "../components/PriorityDial";
import MembershipBar from "../components/MembershipBar";
import StatTile from "../components/StatTile";
import FuzzyWave from "../components/FuzzyWave";
import { useAnalysis } from "../context/AnalysisContext";
import { RISK_COLOR, riskBgClass, riskTextClass } from "../lib/theme";
import { Link } from "react-router-dom";

const INPUT_CONFIG = [
  {
    key: "cpu_temperature" as const,
    label: "CPU Temperature",
    icon: Thermometer,
    min: 20,
    max: 100,
    unit: "°C",
    normalRange: [20, 65] as [number, number],
  },
  {
    key: "cpu_usage" as const,
    label: "CPU Usage",
    icon: Cpu,
    min: 0,
    max: 100,
    unit: "%",
    normalRange: [0, 60] as [number, number],
  },
  {
    key: "ram_usage" as const,
    label: "RAM Usage",
    icon: MemoryStick,
    min: 0,
    max: 100,
    unit: "%",
    normalRange: [0, 65] as [number, number],
  },
  {
    key: "disk_usage" as const,
    label: "Disk Usage",
    icon: HardDrive,
    min: 0,
    max: 100,
    unit: "%",
    normalRange: [0, 70] as [number, number],
  },
  {
    key: "fan_speed" as const,
    label: "Fan Speed",
    icon: Fan,
    min: 500,
    max: 4000,
    unit: "RPM",
    normalRange: [1800, 3200] as [number, number],
  },
  {
    key: "uptime" as const,
    label: "System Uptime",
    icon: Clock,
    min: 0,
    max: 365,
    unit: "days",
    normalRange: [0, 120] as [number, number],
  },
];

export default function Dashboard() {
  const { telemetry, setTelemetry, result, isAnalyzing, error, runAnalysis } = useAnalysis();

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-line bg-panel px-6 py-6 shadow-panel">
        <div className="absolute inset-x-0 top-0 h-full opacity-60">
          <FuzzyWave className="h-full w-full" />
        </div>
        <div className="relative">
          <p className="text-[11px] font-medium uppercase tracking-widest text-cyan">
            Predictive Maintenance Console
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            Feed telemetry. Read the fuzzy verdict.
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-muted">
            Every value below is evaluated by SentinelSys's 30-rule fuzzy inference engine —
            the same controller you built in{" "}
            <code className="rounded bg-panel-raised px-1 py-0.5 text-xs text-cyan">
              fuzzy_controller.ipynb
            </code>
            , now served over the API.
          </p>
        </div>
      </div>

      {error && <ApiErrorBanner message={error} />}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Telemetry inputs */}
        <Card
          title="Interactive Telemetry Inputs"
          eyebrow="Step 1"
          className="xl:col-span-3"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-5 sm:grid-cols-2">
            {INPUT_CONFIG.map((cfg) => (
              <TelemetrySlider
                key={cfg.key}
                label={cfg.label}
                icon={cfg.icon}
                value={telemetry[cfg.key]}
                min={cfg.min}
                max={cfg.max}
                unit={cfg.unit}
                normalRange={cfg.normalRange}
                onChange={(v) => setTelemetry({ ...telemetry, [cfg.key]: v })}
              />
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line-soft px-5 py-4">
            <p className="text-xs text-ink-faint">
              Adjust the sliders, then run the fuzzy engine on the current reading.
            </p>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-cyan px-4 py-2.5 text-sm font-semibold text-void shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Analyzing telemetry…
                </>
              ) : (
                <>
                  <ScanLine size={16} />
                  Analyze System
                </>
              )}
            </button>
          </div>
        </Card>

        {/* Result */}
        <Card title="Maintenance Priority" eyebrow="Fuzzy Engine Result" className="xl:col-span-2">
          <div className="flex flex-col items-center gap-5 p-6">
            {result ? (
              <>
                <PriorityDial
                  value={result.maintenance_priority}
                  color={RISK_COLOR[result.risk_level] ?? "#2DD9E8"}
                  label={result.risk_level}
                />
                <div className="grid w-full grid-cols-2 gap-3">
                  <StatTile label="Health Index" value={`${result.health_index}%`} />
                  <StatTile
                    label="Risk Level"
                    value={result.risk_level}
                    valueClass={riskTextClass(result.risk_level)}
                  />
                </div>
                <div
                  className={`w-full rounded-lg border px-4 py-3 text-center text-sm font-medium ${riskBgClass(
                    result.risk_level
                  )}`}
                >
                  {result.status}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <ScanLine size={28} className="text-ink-faint" />
                <p className="text-sm text-ink-muted">No analysis yet</p>
                <p className="max-w-[220px] text-xs text-ink-faint">
                  Set your telemetry values and click "Analyze System" to get a live result from
                  the Python fuzzy engine.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Membership preview */}
        <Card title="Fuzzy Membership Degrees" eyebrow="Live" className="lg:col-span-2">
          {result ? (
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-2">
              {Object.entries(result.membership_degrees).map(([variable, degrees]) => (
                <div key={variable} className="space-y-2">
                  <p className="text-xs font-medium capitalize text-ink">
                    {variable.replace(/_/g, " ")}
                  </p>
                  {Object.entries(degrees).map(([label, value]) => (
                    <MembershipBar
                      key={label}
                      label={label}
                      value={value}
                      color={value > 0 ? "#2DD9E8" : "#2B3542"}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="p-5 text-sm text-ink-faint">
              Run an analysis to see membership degrees for each telemetry input.
            </p>
          )}
          <div className="border-t border-line-soft px-5 py-3">
            <Link to="/analysis" className="text-xs font-medium text-cyan hover:underline">
              View full system analysis →
            </Link>
          </div>
        </Card>

        {/* Recommendation */}
        <Card title="Engine Recommendation" eyebrow="Action">
          <div className="flex h-full flex-col justify-between gap-4 p-5">
            {result ? (
              <>
                <div>
                  <p
                    className={`text-lg font-semibold ${riskTextClass(result.risk_level)}`}
                  >
                    {result.recommendation}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">
                    Derived directly from a maintenance priority of{" "}
                    <span className="font-mono text-ink">
                      {result.maintenance_priority}
                    </span>
                    . The backend picks this recommendation from the fuzzy result — nothing here
                    is randomly generated.
                  </p>
                </div>
                <Link
                  to="/rules"
                  className="rounded-lg border border-line bg-panel-raised px-4 py-2.5 text-center text-sm font-medium text-ink-muted transition hover:border-cyan/40 hover:text-cyan"
                >
                  Inspect triggered rules
                </Link>
              </>
            ) : (
              <p className="text-sm text-ink-faint">
                Recommendations appear here once the fuzzy engine has evaluated a reading.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
