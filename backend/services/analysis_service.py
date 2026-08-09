from fuzzy_engine.engine import engine
from history import store


def run_analysis(telemetry) -> dict:
    """
    telemetry: models.schemas.TelemetryInput

    Maps the API's field names to the fuzzy engine's field names, runs the
    real fuzzy controller, persists the result, and returns the full
    analysis payload (including the assigned history id/timestamp).
    """
    engine_inputs = {
        "cpu_temp": telemetry.cpu_temperature,
        "cpu_usage": telemetry.cpu_usage,
        "ram_usage": telemetry.ram_usage,
        "disk_usage": telemetry.disk_usage,
        "fan_speed": telemetry.fan_speed,
        "uptime": telemetry.uptime,
    }

    result = engine.analyze(engine_inputs)

    saved = store.save_analysis(telemetry.model_dump(), result)

    return {
        "id": saved["id"],
        "timestamp": saved["timestamp"],
        "telemetry": telemetry.model_dump(),
        **result,
    }
