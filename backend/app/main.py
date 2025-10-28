from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, watchlist, events, chat, seed
from app.config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="ReSeek API",
    description="AI-powered earnings call analysis platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(seed.router, prefix="/api/seed", tags=["seed"])


@app.get("/")
async def root():
    return {"message": "ReSeek API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.on_event("startup")
async def startup_event():
    logger.info("ReSeek API starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("ReSeek API shutting down...")
