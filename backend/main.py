# FastAPI app entry point


# main.py
# ─────────────────────────────────────────────
# CineMatch Backend — FastAPI Entry Point
# Run with: uvicorn main:app --reload
# API docs at: http://localhost:8000/docs
# ─────────────────────────────────────────────
import logging
import os
from datetime import datetime
from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, movie_router, user_router

# ── App Setup ─────────────────────────────────
app = FastAPI(
    title="CineMatch API",
    description="Movie recommendation engine with auth, favourites, and history.",
    version = "1.0.0",
)
# ── CORS Middleware ───────────────────────────
# Allows the React frontend (running on localhost:5173) to call this API
# In production, replace "*" with your actual frontend domain
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173","http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# ── Activity Logger ───────────────────────────
# Logs every request to logs/activity.log
LOG_PATH = os.path.join(os.path.dirname(__file__),"logs/activity.log")
os.makedirs(os.path.dirname(LOG_PATH),exist_ok=True)

logging.basicConfig(
    filename = LOG_PATH,
    level = logging.INFO,
    format = "%(asctime)s - %(levelname)s - %(message)s",
    datefmt = "%Y-%m-%d %H:%M:%S",
    encoding = "utf-8",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log every incoming request: method, path and timestamp"""
    response = await call_next(request)
    logging.info(f"{request.method} {request.url.path} {datetime.now()})")
    return response

# ── Register Routers ──────────────────────────
# Each router handles a group of related endpoints
app.include_router(auth_router.router)  # /auth/signup  /auth/login
app.include_router(movie_router.router)  # /movies/search  /movies/recommend  etc.
app.include_router(user_router.router)  # /user/profile  /user/favourites  etc.


# ── Root Endpoint ─────────────────────────────
@app.get("/")
def root():
    return {
        "app": "CineMatch API",
        "version": "1.0.0",
        "docs": "http://localhost:8000/docs",
        "status": "running",
    }