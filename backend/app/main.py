from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, users, documents, ingestion, rag

app = FastAPI(title="RAG Docs API")

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(ingestion.router)
app.include_router(rag.router)


@app.get("/healthz")
def healthz():
    return {"status": "ok"}
