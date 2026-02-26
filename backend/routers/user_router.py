#  /favourites  /history  endpoints
# routers/user_router.py
# ─────────────────────────────────────────────
# FastAPI routes for user-specific data
# All routes require JWT token (logged in users only)
#
# GET  /user/profile              → username + stats
# GET  /user/favourites           → user's saved movies
# POST /user/favourites           → add a movie to favourites
# DELETE /user/favourites         → remove a movie from favourites
# GET  /user/history              → recommendation history
# DELETE /user/history            → clear history
# ─────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth.auth import load_users, save_users
from routers.dependencies import get_current_user

router = APIRouter(prefix="/user", tags=["User"])


# ── Request Models ────────────────────────────


class FavouriteRequest(BaseModel):
    title: str  # Movie title to add/remove


# ── Profile ───────────────────────────────────
@router.get("/profile")
def get_profile(username: str = Depends(get_current_user)):
    """
    Returns basic profile info for the logged-in user.
    Depends(get_current_user) automatically reads and verifies
    the JWT token from the request header.
    """
    users = load_users()
    user = users.get(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    return {
        "username": username,
        "created_at": user["created_at"],
        "total_favourites": len(user["favourites"]),
        "total_searches": len(user["recommendation_history"]),
    }

@router.get("/favourites")
def get_favourites(username: str = Depends(get_current_user)):
    """Returns all saved favourite movies for the logged-in user."""
    users = load_users()
    return {"favourites": users[username]["favourites"]}


@router.post("/favourites")
def add_favourite(request: FavouriteRequest, username: str = Depends(get_current_user)):
    """
    Add a movie to favourites.
    Frontend sends: { "title": "Avatar" }
    """
    users = load_users()
    favourites = users[username]["favourites"]

    if request.title in favourites:
        raise HTTPException(status_code=400, detail="Movie already in favourites.")

    favourites.append(request.title)
    save_users(users)
    return {
        "message": f"'{request.title}' added to favourites.",
        "favourites": favourites,
    }

@router.delete("/favourites")
def remove_favourite(
    request: FavouriteRequest, username: str = Depends(get_current_user)
):
    """
    Remove a movie from favourites.
    Frontend sends: { "title": "Avatar" }
    """
    users = load_users()
    favourites = users[username]["favourites"]

    if request.title not in favourites:
        raise HTTPException(status_code=404, detail="Movie not in favourites.")

    favourites.remove(request.title)
    save_users(users)
    return {
        "message": f"'{request.title}' removed from favourites.",
        "favourites": favourites,
    }

# ── Recommendation History ────────────────────


@router.get("/history")
def get_history(username: str = Depends(get_current_user)):
    """Returns the full recommendation history for the logged-in user."""
    users = load_users()
    return {"history": users[username]["recommendation_history"]}


@router.delete("/history")
def clear_history(username: str = Depends(get_current_user)):
    """Clears all recommendation history for the logged-in user."""
    users = load_users()
    users[username]["recommendation_history"] = []
    save_users(users)
    return {"message": "Recommendation history cleared."}