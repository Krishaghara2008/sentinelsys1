"""
SentinelSys - Intelligent Infrastructure Health Advisor
Fuzzy Controller Version 1.0

This module is a direct, behavior-preserving port of the original
`notebooks/fuzzy_controller.ipynb` developed in the Python simulation.

IMPORTANT: The membership functions, variable universes, and all 30 rules
below are copied verbatim from the notebook. Nothing here has been
re-derived or re-invented — this file only makes the existing logic
importable so the FastAPI service can call into it directly.

If the notebook logic is ever revised, update ONLY this file (or replace
it with a fresh export of the notebook) and the rest of the backend keeps
working unchanged, since everything downstream reads from `build_system()`
and `ANTECEDENTS` / `CONSEQUENT` below.
"""

import numpy as np
from skfuzzy import control as ctrl
import skfuzzy as fuzz


def build_variables():
    """Recreate the Antecedent/Consequent universes exactly as in the notebook."""

    # -------- INPUT VARIABLES --------
    cpu_temp = ctrl.Antecedent(np.arange(20, 101, 1), 'cpu_temp')
    cpu_usage = ctrl.Antecedent(np.arange(0, 101, 1), 'cpu_usage')
    ram_usage = ctrl.Antecedent(np.arange(0, 101, 1), 'ram_usage')
    disk_usage = ctrl.Antecedent(np.arange(0, 101, 1), 'disk_usage')
    fan_speed = ctrl.Antecedent(np.arange(500, 4001, 1), 'fan_speed')
    uptime = ctrl.Antecedent(np.arange(0, 366, 1), 'uptime')

    # -------- OUTPUT VARIABLE --------
    maintenance = ctrl.Consequent(np.arange(0, 101, 1), 'maintenance')

    # ---------------- CPU TEMPERATURE ----------------
    cpu_temp['Low'] = fuzz.trimf(cpu_temp.universe, [20, 20, 50])
    cpu_temp['Normal'] = fuzz.trimf(cpu_temp.universe, [35, 60, 80])
    cpu_temp['High'] = fuzz.trimf(cpu_temp.universe, [65, 100, 100])

    # ---------------- CPU USAGE ----------------
    cpu_usage['Low'] = fuzz.trimf(cpu_usage.universe, [0, 0, 50])
    cpu_usage['Medium'] = fuzz.trimf(cpu_usage.universe, [25, 50, 75])
    cpu_usage['High'] = fuzz.trimf(cpu_usage.universe, [50, 100, 100])

    # ---------------- RAM USAGE ----------------
    ram_usage['Low'] = fuzz.trimf(ram_usage.universe, [0, 0, 50])
    ram_usage['Medium'] = fuzz.trimf(ram_usage.universe, [25, 50, 75])
    ram_usage['High'] = fuzz.trimf(ram_usage.universe, [50, 100, 100])

    # ---------------- DISK USAGE ----------------
    disk_usage['Low'] = fuzz.trimf(disk_usage.universe, [0, 0, 50])
    disk_usage['Medium'] = fuzz.trimf(disk_usage.universe, [25, 50, 75])
    disk_usage['High'] = fuzz.trimf(disk_usage.universe, [50, 100, 100])

    # ---------------- FAN SPEED ----------------
    fan_speed['Slow'] = fuzz.trimf(fan_speed.universe, [500, 500, 1800])
    fan_speed['Normal'] = fuzz.trimf(fan_speed.universe, [1500, 2500, 3200])
    fan_speed['Fast'] = fuzz.trimf(fan_speed.universe, [2800, 4000, 4000])

    # ---------------- UPTIME ----------------
    uptime['Short'] = fuzz.trimf(uptime.universe, [0, 0, 100])
    uptime['Medium'] = fuzz.trimf(uptime.universe, [80, 180, 280])
    uptime['Long'] = fuzz.trimf(uptime.universe, [250, 365, 365])

    # ---------------- OUTPUT (MAINTENANCE) ----------------
    maintenance['Healthy'] = fuzz.trimf(maintenance.universe, [0, 0, 20])
    maintenance['Monitor'] = fuzz.trimf(maintenance.universe, [15, 30, 45])
    maintenance['Cleaning'] = fuzz.trimf(maintenance.universe, [40, 55, 70])
    maintenance['Maintenance'] = fuzz.trimf(maintenance.universe, [65, 80, 90])
    maintenance['Critical'] = fuzz.trimf(maintenance.universe, [85, 100, 100])

    antecedents = {
        'cpu_temp': cpu_temp,
        'cpu_usage': cpu_usage,
        'ram_usage': ram_usage,
        'disk_usage': disk_usage,
        'fan_speed': fan_speed,
        'uptime': uptime,
    }

    return antecedents, maintenance


def build_rules(antecedents, maintenance):
    """The 30 fuzzy rules, copied verbatim from the notebook."""
    cpu_temp = antecedents['cpu_temp']
    cpu_usage = antecedents['cpu_usage']
    ram_usage = antecedents['ram_usage']
    disk_usage = antecedents['disk_usage']
    fan_speed = antecedents['fan_speed']
    uptime = antecedents['uptime']

    rule1 = ctrl.Rule(cpu_temp['High'], maintenance['Critical'])
    rule2 = ctrl.Rule(cpu_temp['Normal'], maintenance['Monitor'])
    rule3 = ctrl.Rule(cpu_temp['Low'], maintenance['Healthy'])
    rule4 = ctrl.Rule(cpu_temp['High'] & fan_speed['Slow'], maintenance['Critical'])
    rule5 = ctrl.Rule(cpu_temp['High'] & cpu_usage['High'], maintenance['Critical'])
    rule6 = ctrl.Rule(cpu_usage['High'], maintenance['Maintenance'])
    rule7 = ctrl.Rule(cpu_usage['Medium'], maintenance['Monitor'])
    rule8 = ctrl.Rule(cpu_usage['Low'], maintenance['Healthy'])
    rule9 = ctrl.Rule(cpu_usage['High'] & ram_usage['High'], maintenance['Maintenance'])
    rule10 = ctrl.Rule(cpu_usage['High'] & disk_usage['High'], maintenance['Critical'])
    rule11 = ctrl.Rule(ram_usage['High'], maintenance['Maintenance'])
    rule12 = ctrl.Rule(ram_usage['Medium'], maintenance['Cleaning'])
    rule13 = ctrl.Rule(ram_usage['Low'], maintenance['Healthy'])
    rule14 = ctrl.Rule(ram_usage['High'] & uptime['Long'], maintenance['Maintenance'])
    rule15 = ctrl.Rule(ram_usage['High'] & cpu_temp['High'], maintenance['Critical'])
    rule16 = ctrl.Rule(disk_usage['High'], maintenance['Maintenance'])
    rule17 = ctrl.Rule(disk_usage['Medium'], maintenance['Cleaning'])
    rule18 = ctrl.Rule(disk_usage['Low'], maintenance['Healthy'])
    rule19 = ctrl.Rule(disk_usage['High'] & uptime['Long'], maintenance['Maintenance'])
    rule20 = ctrl.Rule(disk_usage['High'] & cpu_usage['High'], maintenance['Critical'])
    rule21 = ctrl.Rule(fan_speed['Slow'], maintenance['Maintenance'])
    rule22 = ctrl.Rule(fan_speed['Normal'], maintenance['Healthy'])
    rule23 = ctrl.Rule(fan_speed['Fast'], maintenance['Monitor'])
    rule24 = ctrl.Rule(fan_speed['Slow'] & cpu_temp['High'], maintenance['Critical'])
    rule25 = ctrl.Rule(fan_speed['Fast'] & cpu_temp['Normal'], maintenance['Monitor'])
    rule26 = ctrl.Rule(uptime['Long'], maintenance['Maintenance'])
    rule27 = ctrl.Rule(uptime['Medium'], maintenance['Monitor'])
    rule28 = ctrl.Rule(uptime['Short'], maintenance['Healthy'])
    rule29 = ctrl.Rule(uptime['Long'] & cpu_temp['High'], maintenance['Critical'])
    rule30 = ctrl.Rule(
        uptime['Long'] & cpu_usage['High'] & ram_usage['High'],
        maintenance['Critical'],
    )

    return [
        rule1, rule2, rule3, rule4, rule5,
        rule6, rule7, rule8, rule9, rule10,
        rule11, rule12, rule13, rule14, rule15,
        rule16, rule17, rule18, rule19, rule20,
        rule21, rule22, rule23, rule24, rule25,
        rule26, rule27, rule28, rule29, rule30,
    ]


def build_system():
    """Build the ControlSystem + a fresh simulation object, matching the notebook."""
    antecedents, maintenance = build_variables()
    rules = build_rules(antecedents, maintenance)
    system = ctrl.ControlSystem(rules)
    simulation = ctrl.ControlSystemSimulation(system)
    return antecedents, maintenance, rules, system, simulation
