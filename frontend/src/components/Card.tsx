import type { ReactNode } from "react";
import type React from "react";

export default function Card({
  children,
  className = "",
  title,
  eyebrow,
  action,
  style,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-xl border border-line bg-panel shadow-panel ${className}`}
      style={style}
    >
      {(title || eyebrow || action) && (
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-medium uppercase tracking-widest text-ink-faint">
                {eyebrow}
              </p>
            )}
            {title && <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
