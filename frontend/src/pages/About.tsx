import { GitBranch, Layers, ServerCog, Workflow } from "lucide-react";
import Card from "../components/Card";
import FuzzyWave from "../components/FuzzyWave";

const PIPELINE = [
  {
    icon: Layers,
    title: "React Dashboard",
    body: "Telemetry sliders and result views. Renders API responses only — no fuzzy math happens here.",
  },
  {
    icon: ServerCog,
    title: "FastAPI REST API",
    body: "Validates telemetry, calls the fuzzy engine, and persists every analysis to SQLite.",
  },
  {
    icon: Workflow,
    title: "Python Fuzzy Logic Engine",
    body: "A direct port of fuzzy_controller.ipynb — same membership functions, same 30 rules.",
  },
  {
    icon: GitBranch,
    title: "Maintenance Priority / Health / Risk",
    body: "The real skfuzzy defuzzified output, plus derived health index, risk level, and recommendation.",
  },
];

export default function About() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-line bg-panel px-6 py-6 shadow-panel">
        <div className="absolute inset-x-0 top-0 h-full opacity-50">
          <FuzzyWave className="h-full w-full" />
        </div>
        <div className="relative">
          <p className="text-[11px] font-medium uppercase tracking-widest text-cyan">
            About SentinelSys
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
            A fuzzy-logic predictive maintenance advisor
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            SentinelSys evaluates system telemetry — CPU temperature and usage, RAM, disk, fan
            speed, and uptime — through a 30-rule Mamdani fuzzy inference system to produce a
            Maintenance Priority score, health index, risk level, and a concrete recommendation.
          </p>
        </div>
      </div>

      <Card title="Architecture" eyebrow="How it fits together">
        <div className="grid grid-cols-1 divide-y divide-line-soft sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {PIPELINE.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="p-5">
              <div className="flex items-center gap-2 text-xs font-medium text-ink-faint">
                <span className="font-mono">{String(i + 1).padStart(2, "0")}</span>
                <Icon size={14} className="text-cyan" />
              </div>
              <p className="mt-2 text-sm font-medium text-ink">{title}</p>
              <p className="mt-1 text-xs text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Design Intent" eyebrow="Notes">
        <div className="space-y-3 p-5 text-sm text-ink-muted">
          <p>
            This is a simulation/analysis dashboard connected to a real fuzzy engine — it does not
            claim to monitor actual hardware unless wired to a live telemetry source.
          </p>
          <p>
            Every number shown — membership degrees, firing strengths, the priority score — is
            computed by skfuzzy from the same rules and membership functions defined in the
            original notebook. The frontend never calculates or fabricates fuzzy results.
          </p>
        </div>
      </Card>
    </div>
  );
}
