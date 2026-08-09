const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const ARC_FRACTION = 0.75; // 270 degree sweep
const ARC_LEN = CIRC * ARC_FRACTION;
const ROTATE = 135; // start angle so the gap sits at the bottom

export default function PriorityDial({
  value,
  color,
  label,
}: {
  value: number;
  color: string;
  label: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  const filled = (clamped / 100) * ARC_LEN;

  return (
    <div className="relative flex h-[200px] w-[200px] items-center justify-center">
      <svg width={SIZE} height={SIZE} className="-rotate-0">
        <g transform={`rotate(${ROTATE} ${SIZE / 2} ${SIZE / 2})`}>
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#1E2733"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${ARC_LEN} ${CIRC}`}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${CIRC}`}
            style={{
              filter: `drop-shadow(0 0 6px ${color}99)`,
              transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease",
            }}
          />
        </g>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-mono text-4xl font-semibold tabular text-ink"
          style={{ textShadow: `0 0 18px ${color}55` }}
        >
          {clamped.toFixed(2)}
        </span>
        <span className="text-xs text-ink-faint">/ 100</span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
