from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from history.store import init_db

app = FastAPI(
    title="SentinelSys API",
    description="Fuzzy Logic Predictive Maintenance engine for SentinelSys.",
    version="1.0.0",
)

# CORS enabled for the Vite dev server / built frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"service": "SentinelSys API", "status": "online", "docs": "/docs"}
