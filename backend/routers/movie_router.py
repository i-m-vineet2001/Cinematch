# /search  /details  endpoints

# routers/movie_router.py
# ─────────────────────────────────────────────
# FastAPI routes for movie data
# GET /movies/search?q=iron man     → search results
# GET /movies/details?title=Avatar  → full movie details
# GET /movies/recommend?title=Avatar&top_n=10 → recommendations
# GET /movies/home                  → popular movies for home page
# GET /movies/genre?name=Action     → movies by genre
# ─────────────────────────────────────────────

from fastapi import APIRouter, HTTPException, Query, Depends
from engine.search import (
    search_movies,
    get_movie_details,
    get_all_movies,
    get_movies_by_genre,
)
from engine.recommender import recommend
from routers.dependencies import get_current_user
from auth.auth import load_users, save_users
from datetime import datetime

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("/home")
def home_movies():
    """
    Returns top 50 popular movies for the home page browse section.
    Sorted by popularity — no auth required.
    """
    return get_all_movies(limit=50)

@router.get("/search")
def search(q: str = Query(..., description="Movie title to search for")):
    """
    Partial search by title.
    Example: /movies/search?q=iron
    Returns list of matching movies.
    """
    results = search_movies(q)
    if not results:
        raise HTTPException(status_code=404, detail=f"No movies found for '{q}'")
    return results


@router.get("/details")
def details(title: str = Query(..., description="Exact movie title")):
    """
    Full details for a single movie.
    Example: /movies/details?title=Avatar
    """
    try:
        return get_movie_details(title)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/recommend")
def recommendations(
    title: str = Query(..., description="Movie title to base recommendations on"),
    top_n: int = Query(10, description="Number of recommendations to return"),
    username: str = Depends(get_current_user),  # ← requires login
):
    """
    Get top N similar movies for a given title.
    Requires JWT token in Authorization header.
    Also saves this to the user's recommendation_history.

    Example: /movies/recommend?title=Avatar&top_n=10
    """
    try:
        results = recommend(title, top_n=top_n)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    # ── Save to recommendation history ────────
    users = load_users()
    if username in users:
        history_entry = {
            "searched_movie": title,
            "recommendations": [r["title"] for r in results],
            "timestamp": datetime.now().isoformat(),
        }
        users[username]["recommendation_history"].append(history_entry)
        save_users(users)

    return results

@router.get("/genre")
def by_genre(name: str = Query(..., description="Genre name e.g. Action, Comedy")):
    """
    Returns movies filtered by genre.
    Used to build Netflix-style genre rows on the home page.
    Example: /movies/genre?name=Action
    """
    results = get_movies_by_genre(name)
    if not results:
        raise HTTPException(
            status_code=404, detail=f"No movies found for genre '{name}'"
        )
    return results