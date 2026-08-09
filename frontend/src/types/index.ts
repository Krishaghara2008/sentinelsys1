export interface TelemetryInput {
  cpu_temperature: number;
  cpu_usage: number;
  ram_usage: number;
  disk_usage: number;
  fan_speed: number;
  uptime: number;
}

export interface RuleFiring {
  rule_number: number;
  description: string;
  consequent: string;
  firing_strength: number;
  fired: boolean;
}

export interface RuleCatalogEntry {
  rule_number: number;
  description: string;
  consequent: string;
  variables: string[];
}

export type MembershipDegrees = Record<string, Record<string, number>>;

export interface AnalysisResult {
  id?: number;
  timestamp?: string;
  telemetry: TelemetryInput;
  maintenance_priority: number;
  health_index: number;
  risk_level: "Low" | "Moderate" | "High" | "Critical" | string;
  status: string;
  recommendation: string;
  membership_degrees: MembershipDegrees;
  fired_rules: RuleFiring[];
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  telemetry: TelemetryInput;
  maintenance_priority: number;
  health_index: number;
  risk_level: string;
  status: string;
}

export interface HealthCheck {
  status: string;
  fuzzy_engine: string;
  rules_loaded: number;
  timestamp: string;
}
