# SentinelSys — Fuzzy Logic Predictive Maintenance

A professional monitoring dashboard for a fuzzy-logic predictive maintenance system, built on
top of your existing `notebooks/fuzzy_controller.ipynb` logic — untouched and unmodified.

```
React Dashboard  →  FastAPI REST API  →  Python Fuzzy Logic Engine  →  Results
```

- **Frontend**: React + Vite + TypeScript, Tailwind CSS, Recharts, Lucide, React Router
- **Backend**: FastAPI + Pydantic, CORS enabled
- **Fuzzy engine**: `scikit-fuzzy`, ported line-for-line from your notebook

Every number the dashboard shows — Maintenance Priority, Health Index, Risk Level, membership
degrees, rule firing strengths — comes straight from the real fuzzy engine. Nothing is
hard-coded or invented in the frontend.

## Project layout

```
sentinelsys/
  backend/
    main.py                  FastAPI app entrypoint
    api/routes.py             /api/health, /api/analyze, /api/rules, /api/history, /api/analysis/{id}
    services/analysis_service.py
    models/schemas.py         Pydantic request/response models
    fuzzy_engine/
      controller.py           Your fuzzy controller, ported verbatim from the notebook
      rules_meta.py            Human-readable descriptions of the 30 rules
      engine.py                Orchestration: membership degrees, firing strengths, priority
    history/store.py          SQLite persistence for analysis history
    requirements.txt
  frontend/
    src/
      pages/                  Dashboard, System Analysis, Fuzzy Rules, History, Reports, Settings, About
      components/             Sidebar, TopBar, Card, PriorityDial, TelemetrySlider, MembershipBar, ...
      context/                Shared analysis state + backend connection status
      api/client.ts           Typed fetch wrapper for the FastAPI backend
    package.json
    .env.example
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- Git

## Running it

### Backend

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment (optional but recommended):

**Windows (PowerShell)**
```bash
.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Then install dependencies and run:

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The API comes up at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
```

Copy the environment file:

**Windows (PowerShell)**
```bash
copy .env.example .env
```

**macOS / Linux**
```bash
cp .env.example .env
```

Then run:

```bash
npm run dev
```

Defaults to `VITE_API_URL=http://localhost:8000`. Open the URL Vite prints (usually `http://localhost:5173`).

Run both at once and the dashboard will show **API: Connected** in the header and light up
with live data as soon as you click **Analyze System**.

## Connecting your actual notebook logic

`backend/fuzzy_engine/controller.py` currently contains a direct port of the membership
functions and all 30 rules from `fuzzy_controller.ipynb`, wrapped in `build_system()`. If your
notebook logic evolves:

1. Update `controller.py`'s `build_variables()` / `build_rules()` to match your latest notebook
   (or export the notebook cells directly into that file).
2. If you add/remove/reorder rules, update `rules_meta.py`'s `RULES` list to match — it's what
   powers the Fuzzy Rule Inspector page and the per-rule firing strengths.
3. Everything else (API, frontend) reads from `fuzzy_engine/engine.py`'s `SentinelFuzzyEngine`
   and doesn't need to change.

## API reference

| Method | Path                    | Description                                      |
|--------|-------------------------|---------------------------------------------------|
| GET    | `/api/health`           | Engine + API status                                |
| POST   | `/api/analyze`          | Run telemetry through the fuzzy engine             |
| GET    | `/api/rules`            | Static catalog of all 30 rules                     |
| GET    | `/api/history`          | Paginated list of past analyses                    |
| GET    | `/api/analysis/{id}`    | Full stored result for one past analysis           |

`POST /api/analyze` request body:

```json
{
  "cpu_temperature": 52,
  "cpu_usage": 40,
  "ram_usage": 55,
  "disk_usage": 50,
  "fan_speed": 2400,
  "uptime": 7
}
```

Response includes `maintenance_priority`, `health_index`, `risk_level`, `status`,
`recommendation`, `membership_degrees`, and `fired_rules` — all computed live by skfuzzy.

## Notes

- History is stored in a local SQLite file (`backend/data/history.db`), created automatically
  on first run. Swap `backend/history/store.py` for a real database later without touching the
  API layer.
- If the backend is unreachable, the UI shows a clear connection error — it never silently
  falls back to fake data.
- Verified end-to-end: feeding the notebook's own example telemetry through the API reproduces
  `Maintenance Priority: 84.12`, `Health Index: 15.88%`, `Risk: High` exactly.git pull