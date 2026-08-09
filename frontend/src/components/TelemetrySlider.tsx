import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  icon: LucideIcon;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  normalRange: [number, number];
  onChange: (value: number) => void;
  formatValue?: (v: number) => string;
}

export default function TelemetrySlider({
  label,
  icon: Icon,
  value,
  min,
  max,
  step = 1,
  unit,
  normalRange,
  onChange,
  formatValue,
}: Props) {
  const pct = ((value - min) / (max - min)) * 100;
  const normalStart = ((normalRange[0] - min) / (max - min)) * 100;
  const normalEnd = ((normalRange[1] - min) / (max - min)) * 100;
  const inRange = value >= normalRange[0] && value <= normalRange[1];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink-muted">
          <Icon size={15} className="text-cyan" strokeWidth={2} />
          {label}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-base font-semibold tabular text-ink">
            {formatValue ? formatValue(value) : value}
          </span>
          <span className="text-xs text-ink-faint">{unit}</span>
        </div>
      </div>

      <div className="relative">
        {/* normal-range indicator track */}
        <div className="pointer-events-none absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-line">
          <div
            className="absolute h-full rounded-full bg-healthy/25"
            style={{ left: `${normalStart}%`, width: `${normalEnd - normalStart}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-slider relative z-10 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent"
          style={{
            background: `linear-gradient(to right, #2DD9E8 0%, #2DD9E8 ${pct}%, transparent ${pct}%, transparent 100%)`,
          }}
          aria-label={label}
        />
      </div>

      <p className="text-[11px] text-ink-faint">
        {inRange ? (
          <span className="text-healthy">Within normal range</span>
        ) : (
          <span className="text-maintenance">
            Outside normal range ({normalRange[0]}–{normalRange[1]} {unit})
          </span>
        )}
      </p>
    </div>
  );
}
