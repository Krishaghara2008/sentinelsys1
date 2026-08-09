export type ConsequentLabel = "Healthy" | "Monitor" | "Cleaning" | "Maintenance" | "Critical";

export const CONSEQUENT_COLOR: Record<string, string> = {
  Healthy: "#34D399",
  Monitor: "#5EC8E8",
  Cleaning: "#F5B84C",
  Maintenance: "#F5924C",
  Critical: "#FF5C72",
};

export const RISK_COLOR: Record<string, string> = {
  Low: "#34D399",
  Moderate: "#5EC8E8",
  High: "#F5924C",
  Critical: "#FF5C72",
};

export function riskTextClass(risk: string): string {
  switch (risk) {
    case "Low":
      return "text-healthy";
    case "Moderate":
      return "text-monitor";
    case "High":
      return "text-maintenance";
    case "Critical":
      return "text-critical";
    default:
      return "text-ink-muted";
  }
}

export function riskBgClass(risk: string): string {
  switch (risk) {
    case "Low":
      return "bg-healthy/10 border-healthy/30";
    case "Moderate":
      return "bg-monitor/10 border-monitor/30";
    case "High":
      return "bg-maintenance/10 border-maintenance/30";
    case "Critical":
      return "bg-critical/10 border-critical/30 animate-pulse-glow";
    default:
      return "bg-panel-raised border-line";
  }
}

export function formatTimestamp(ts?: string): string {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return ts;
  }
}
