"""
Lightweight SQLite persistence for analysis history.

Kept deliberately simple for the first version of SentinelSys — a single
table, no ORM. Swap this module out for a real database later without
touching the API layer, since routes only call the functions below.
"""

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "history.db"


def _connect():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = _connect()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            telemetry_json TEXT NOT NULL,
            maintenance_priority REAL NOT NULL,
            health_index REAL NOT NULL,
            risk_level TEXT NOT NULL,
            status TEXT NOT NULL,
            result_json TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_analysis(telemetry: dict, result: dict) -> dict:
    conn = _connect()
    timestamp = datetime.now(timezone.utc).isoformat()
    cur = conn.execute(
        """INSERT INTO analyses
           (timestamp, telemetry_json, maintenance_priority, health_index, risk_level, status, result_json)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (
            timestamp,
            json.dumps(telemetry),
            result["maintenance_priority"],
            result["health_index"],
            result["risk_level"],
            result["status"],
            json.dumps(result),
        ),
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return {"id": row_id, "timestamp": timestamp}


def list_history(limit: int = 100, offset: int = 0) -> List[dict]:
    conn = _connect()
    rows = conn.execute(
        """SELECT id, timestamp, telemetry_json, maintenance_priority,
                  health_index, risk_level, status
           FROM analyses ORDER BY id DESC LIMIT ? OFFSET ?""",
        (limit, offset),
    ).fetchall()
    conn.close()
    out = []
    for r in rows:
        telemetry = json.loads(r["telemetry_json"])
        out.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "telemetry": telemetry,
            "maintenance_priority": r["maintenance_priority"],
            "health_index": r["health_index"],
            "risk_level": r["risk_level"],
            "status": r["status"],
        })
    return out


def get_analysis(analysis_id: int) -> Optional[dict]:
    conn = _connect()
    row = conn.execute(
        "SELECT id, timestamp, result_json FROM analyses WHERE id = ?",
        (analysis_id,),
    ).fetchone()
    conn.close()
    if row is None:
        return None
    result = json.loads(row["result_json"])
    result["id"] = row["id"]
    result["timestamp"] = row["timestamp"]
    return result
