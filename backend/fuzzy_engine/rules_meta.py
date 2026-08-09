"""
Rule metadata for the SentinelSys Fuzzy Rule Inspector.

Each entry mirrors one `ctrl.Rule(...)` in fuzzy_engine/controller.py
exactly (same antecedent terms, same consequent). This is used to:
  1. Render a human-readable description of each of the 30 rules.
  2. Recompute each rule's firing strength (min of its antecedent
     membership degrees) for a given telemetry reading, without needing
     to inspect skfuzzy's internal rule graph.

If controller.py's rules ever change, update this list to match —
the two are kept in the same order (rule 1 first).
"""

VARIABLE_LABELS = {
    "cpu_temp": "CPU Temperature",
    "cpu_usage": "CPU Usage",
    "ram_usage": "RAM Usage",
    "disk_usage": "Disk Usage",
    "fan_speed": "Fan Speed",
    "uptime": "System Uptime",
}

# (rule number, [(variable, label), ...] ANDed terms, consequent label)
RULES = [
    (1, [("cpu_temp", "High")], "Critical"),
    (2, [("cpu_temp", "Normal")], "Monitor"),
    (3, [("cpu_temp", "Low")], "Healthy"),
    (4, [("cpu_temp", "High"), ("fan_speed", "Slow")], "Critical"),
    (5, [("cpu_temp", "High"), ("cpu_usage", "High")], "Critical"),
    (6, [("cpu_usage", "High")], "Maintenance"),
    (7, [("cpu_usage", "Medium")], "Monitor"),
    (8, [("cpu_usage", "Low")], "Healthy"),
    (9, [("cpu_usage", "High"), ("ram_usage", "High")], "Maintenance"),
    (10, [("cpu_usage", "High"), ("disk_usage", "High")], "Critical"),
    (11, [("ram_usage", "High")], "Maintenance"),
    (12, [("ram_usage", "Medium")], "Cleaning"),
    (13, [("ram_usage", "Low")], "Healthy"),
    (14, [("ram_usage", "High"), ("uptime", "Long")], "Maintenance"),
    (15, [("ram_usage", "High"), ("cpu_temp", "High")], "Critical"),
    (16, [("disk_usage", "High")], "Maintenance"),
    (17, [("disk_usage", "Medium")], "Cleaning"),
    (18, [("disk_usage", "Low")], "Healthy"),
    (19, [("disk_usage", "High"), ("uptime", "Long")], "Maintenance"),
    (20, [("disk_usage", "High"), ("cpu_usage", "High")], "Critical"),
    (21, [("fan_speed", "Slow")], "Maintenance"),
    (22, [("fan_speed", "Normal")], "Healthy"),
    (23, [("fan_speed", "Fast")], "Monitor"),
    (24, [("fan_speed", "Slow"), ("cpu_temp", "High")], "Critical"),
    (25, [("fan_speed", "Fast"), ("cpu_temp", "Normal")], "Monitor"),
    (26, [("uptime", "Long")], "Maintenance"),
    (27, [("uptime", "Medium")], "Monitor"),
    (28, [("uptime", "Short")], "Healthy"),
    (29, [("uptime", "Long"), ("cpu_temp", "High")], "Critical"),
    (30, [("uptime", "Long"), ("cpu_usage", "High"), ("ram_usage", "High")], "Critical"),
]


def describe_rule(terms, consequent_label):
    """Build a human-readable 'IF ... AND ... THEN ...' description."""
    parts = [f"{VARIABLE_LABELS[var]} is {label}" for var, label in terms]
    condition = " AND ".join(parts)
    return f"IF {condition} THEN Maintenance Priority is {consequent_label}"
