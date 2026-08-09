from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from fuzzy_engine.engine import engine
from history import store
from models.schemas import AnalysisResult, HealthCheck, TelemetryInput
from services.analysis_service import run_analysis

router = APIRouter()


@router.get("/health", response_model=HealthCheck)
def health_check():
    return HealthCheck(
        status="online",
        fuzzy_engine="active",
        rules_loaded=len(engine.rules),
        timestamp=datetime.now(timezone.utc),
    )


@router.post("/analyze", response_model=AnalysisResult)
def analyze(telemetry: TelemetryInput):
    try:
        result = run_analysis(telemetry)
    except Exception as exc:  # surfaces a clean 500 instead of a stack trace
        raise HTTPException(status_code=500, detail=f"Fuzzy engine error: {exc}")
    return result


@router.get("/rules")
def get_rules():
    return {"rules": engine.rules_catalog(), "total": len(engine.rules)}


@router.get("/history")
def get_history(limit: int = 50, offset: int = 0):
    return {"analyses": store.list_history(limit=limit, offset=offset)}


@router.get("/analysis/{analysis_id}", response_model=AnalysisResult)
def get_analysis(analysis_id: int):
    result = store.get_analysis(analysis_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return result
