# routers/dependencies.py
# ─────────────────────────────────────────────
# Shared FastAPI dependencies
# get_current_user is injected into any route that requires login
# FastAPI calls this automatically via Depends(get_current_user)
# ─────────────────────────────────────────────

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from auth.auth import verify_token

# This tells FastAPI to look for a Bearer token in the
# Authorization header: "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Extracts and verifies the JWT token from the request header.
    Returns the username if valid.
    Raises 401 if token is missing, invalid, or expired.

    Usage in any router:
        @router.get("/protected")
        def protected_route(username: str = Depends(get_current_user)):
            return {"hello": username}
    """
    try:
        return verify_token(token)
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid or expired token. Please log in again."
        )
