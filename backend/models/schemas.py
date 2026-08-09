from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class TelemetryInput(BaseModel):
    cpu_temperature: float = Field(..., ge=20, le=100, description="Degrees Celsius")
    cpu_usage: float = Field(..., ge=0, le=100, description="Percent")
    ram_usage: float = Field(..., ge=0, le=100, description="Percent")
    disk_usage: float = Field(..., ge=0, le=100, description="Percent")
    fan_speed: float = Field(..., ge=500, le=4000, description="RPM")
    uptime: float = Field(..., ge=0, le=365, description="Days")


class RuleFiring(BaseModel):
    rule_number: int
    description: str
    consequent: str
    firing_strength: float
    fired: bool


class RuleCatalogEntry(BaseModel):
    rule_number: int
    description: str
    consequent: str
    variables: List[str]


class AnalysisResult(BaseModel):
    id: Optional[int] = None
    timestamp: Optional[datetime] = None
    telemetry: TelemetryInput
    maintenance_priority: float
    health_index: float
    risk_level: str
    status: str
    recommendation: str
    membership_degrees: Dict[str, Dict[str, float]]
    fired_rules: List[RuleFiring]


class HealthCheck(BaseModel):
    status: str
    fuzzy_engine: str
    rules_loaded: int
    timestamp: datetime
