import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel-raised">
        <Icon size={19} className="text-ink-faint" />
      </div>
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-faint">{description}</p>
    </div>
  );
}
