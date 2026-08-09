"""
SentinelFuzzyEngine

Thin orchestration layer around the existing (unmodified) fuzzy logic in
controller.py. This is the ONLY place that turns a telemetry reading into
the full result the dashboard needs:

  - maintenance_priority : the real skfuzzy defuzzified output
  - health_index          : 100 - maintenance_priority
  - risk_level / status   : derived from the priority score (no separate
                             logic re-implements the fuzzy math — these are
                             just human-readable labels for the same number)
  - membership_degrees    : fuzz.interp_membership() for every antecedent
                             label, computed directly from the notebook's
                             membership functions
  - fired_rules           : firing strength (min of antecedent memberships,
                             skfuzzy's own AND operator) for all 30 rules

No fuzzy value here is invented — every number traces back to either
skfuzzy's `simulation.compute()` output or `fuzz.interp_membership()`
against the exact membership functions defined in controller.py.
"""

import skfuzzy as fuzz

from .controller import build_system
from .rules_meta import RULES, VARIABLE_LABELS, describe_rule

INPUT_FIELDS = [
    "cpu_temp", "cpu_usage", "ram_usage",
    "disk_usage", "fan_speed", "uptime",
]

# Ordered category labels per antecedent (matches controller.py definitions)
CATEGORY_ORDER = {
    "cpu_temp": ["Low", "Normal", "High"],
    "cpu_usage": ["Low", "Medium", "High"],
    "ram_usage": ["Low", "Medium", "High"],
    "disk_usage": ["Low", "Medium", "High"],
    "fan_speed": ["Slow", "Normal", "Fast"],
    "uptime": ["Short", "Medium", "Long"],
}


def _risk_and_status(priority: float):
    """Human-readable risk banding derived from the real priority score."""
    if priority < 25:
        return "Low", "Normal Monitoring"
    if priority < 50:
        return "Moderate", "Monitor System"
    if priority < 90:
        return "High", "Maintenance Recommended"
    return "Critical", "Immediate Maintenance Attention"


class SentinelFuzzyEngine:
    """
    Rebuilds the notebook's ControlSystem once per instance and exposes a
    single `analyze()` entry point. skfuzzy's ControlSystemSimulation is
    stateful per-run, so a fresh simulation is created per analysis to
    avoid cross-request contamination.
    """

    def __init__(self):
        self.antecedents, self.maintenance, self.rules, self.system, _ = build_system()

    def _fresh_simulation(self):
        from skfuzzy import control as ctrl
        return ctrl.ControlSystemSimulation(self.system)

    def membership_degrees(self, inputs: dict) -> dict:
        """Degree of membership (0-1) in every fuzzy label, for every input."""
        result = {}
        for field in INPUT_FIELDS:
            var = self.antecedents[field]
            value = inputs[field]
            # clip into the variable's universe so out-of-range sliders
            # never crash interp_membership
            lo, hi = var.universe[0], var.universe[-1]
            clipped = min(max(value, lo), hi)
            degrees = {}
            for label in CATEGORY_ORDER[field]:
                mf = var[label].mf
                degrees[label] = round(
                    float(fuzz.interp_membership(var.universe, mf, clipped)), 4
                )
            result[field] = degrees
        return result

    def fired_rules(self, degrees: dict, threshold: float = 0.0):
        """Firing strength for each of the 30 rules using skfuzzy's AND (min)."""
        rules_out = []
        for number, terms, consequent in RULES:
            strengths = [degrees[var][label] for var, label in terms]
            strength = round(min(strengths), 4)
            rules_out.append({
                "rule_number": number,
                "description": describe_rule(terms, consequent),
                "consequent": consequent,
                "firing_strength": strength,
                "fired": strength > threshold,
            })
        return rules_out

    def analyze(self, inputs: dict) -> dict:
        """
        Run the real fuzzy controller on a telemetry reading.

        inputs: dict with keys cpu_temp, cpu_usage, ram_usage, disk_usage,
                fan_speed, uptime (numeric).
        """
        simulation = self._fresh_simulation()
        for field in INPUT_FIELDS:
            simulation.input[field] = inputs[field]
        simulation.compute()

        priority = round(float(simulation.output["maintenance"]), 2)
        health_index = round(100 - priority, 2)
        risk_level, status = _risk_and_status(priority)

        degrees = self.membership_degrees(inputs)
        rules = self.fired_rules(degrees)

        return {
            "maintenance_priority": priority,
            "health_index": health_index,
            "risk_level": risk_level,
            "status": status,
            "recommendation": status,
            "membership_degrees": degrees,
            "fired_rules": rules,
        }

    def rules_catalog(self):
        """Static list of all 30 rules (no telemetry-dependent firing data)."""
        return [
            {
                "rule_number": number,
                "description": describe_rule(terms, consequent),
                "consequent": consequent,
                "variables": [VARIABLE_LABELS[v] for v, _ in terms],
            }
            for number, terms, consequent in RULES
        ]


# Singleton — building the ControlSystem has a small fixed cost, so the
# FastAPI app builds it once at startup and reuses it for every request.
engine = SentinelFuzzyEngine()
