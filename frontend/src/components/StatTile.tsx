import type { ReactNode } from "react";

export default function StatTile({
  label,
  value,
  valueClass = "text-ink",
  sub,
}: {
  label: string;
  value: ReactNode;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-line-soft bg-panel-raised px-4 py-3">
      <p className="text-[10px] uppercase tracking-widest text-ink-faint">{label}</p>
      <p className={`mt-1 font-mono text-xl font-semibold tabular ${valueClass}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-ink-faint">{sub}</p>}
    </div>
  );
}
