# /login  /signup  endpoints

# routers/auth_router.py
# ─────────────────────────────────────────────
# FastAPI routes for authentication
# POST /auth/signup  → register new user
# POST /auth/login   → login, returns JWT token
# ─────────────────────────────────────────────

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth.auth import signup_user, login_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ── Request Models ────────────────────────────
# Pydantic models define what JSON body the frontend must send

class SignupRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str

# ── Endpoints ─────────────────────────────────

@router.post("/signup")
def signup(request: SignupRequest):
    """
    Register a new user.
    Frontend sends: { "username": "vineet", "password": "mypass" }
    Returns: { "message": "User created successfully." }
    """
    try:
        result = signup_user(request.username, request.password)
        return result
    except ValueError as e:
        # 400 = Bad Request (e.g. username already taken)
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(request: LoginRequest):
    """
    Login and receive a JWT token.
    Frontend sends: { "username": "vineet", "password": "mypass" }
    Returns: { "access_token": "eyJ...", "token_type": "bearer" }

    The frontend stores this token in localStorage and sends it
    in the Authorization header for protected routes.
    """
    try:
        token = login_user(request.username, request.password)
        return {"access_token": token, "token_type": "bearer"}
    except ValueError as e:
        # 401 = Unauthorized (wrong credentials)
        raise HTTPException(status_code=401, detail=str(e))
