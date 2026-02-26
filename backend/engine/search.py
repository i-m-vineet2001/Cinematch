# # Movie search & details
# # engine/search.py
# # ─────────────────────────────────────────────
# # Handles movie search and fetching full movie details
# # ─────────────────────────────────────────────

import os
import math
import pandas as pd

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/movie_dataset.csv")
df = pd.read_csv(DATA_PATH)


def safe(value, fallback=0):
    """
    Converts NaN, inf, or any non-JSON-safe float to a fallback value.
    This is the root fix for the 'Out of range float values' error.
    """
    if value is None:
        return fallback
    try:
        if math.isnan(float(value)) or math.isinf(float(value)):
            return fallback
    except (TypeError, ValueError):
        pass
    return value


def safe_str(value, fallback=""):
    """Converts NaN strings to empty string."""
    if pd.isna(value):
        return fallback
    return str(value)


def search_movies(query: str, limit: int = 20) -> list:
    """Partial, case-insensitive search by title."""
    results = df[df["title"].str.lower().str.contains(query.lower(), na=False)]
    return _format_movies(results.head(limit))


def get_movie_details(title: str) -> dict:
    """Exact, case-insensitive lookup for a single movie."""
    result = df[df["title"].str.lower() == title.lower()]
    if result.empty:
        raise ValueError(f"Movie '{title}' not found.")
    return _format_movie(result.iloc[0])


def get_all_movies(limit: int = 50) -> list:
    """Returns popular movies for the home page, sorted by popularity."""
    sorted_df = df.sort_values("popularity", ascending=False)
    return _format_movies(sorted_df.head(limit))


def get_movies_by_genre(genre: str, limit: int = None) -> list:
    """
    Filter movies by genre — returns ALL matching movies by default.
    Pass limit to cap results (home page rows use limit=20).
    """
    results = df[df["genres"].str.lower().str.contains(genre.lower(), na=False)]
    sorted_results = results.sort_values("popularity", ascending=False)
    if limit is not None:
        sorted_results = sorted_results.head(limit)
    return _format_movies(sorted_results)


# ── Private Helpers ───────────────────────────


def _format_movie(row) -> dict:
    """
    Convert a DataFrame row into a JSON-safe dict.
    Every field is sanitized through safe() or safe_str()
    to prevent NaN from crashing the JSON encoder.
    """
    return {
        "title": safe_str(row.get("title"), "Unknown"),
        "director": safe_str(row.get("director")),
        "genres": safe_str(row.get("genres")),
        "language": safe_str(row.get("original_language")).upper(),
        "release_date": safe_str(row.get("release_date")),
        "runtime": safe(row.get("runtime"), 0),
        "budget": safe(row.get("budget"), 0),
        "revenue": safe(row.get("revenue"), 0),
        "rating": safe(row.get("vote_average"), 0),
        "vote_count": int(safe(row.get("vote_count"), 0)),
        "popularity": safe(row.get("popularity"), 0),
        "overview": safe_str(row.get("overview")),
        "cast": safe_str(row.get("cast")),
        "keywords": safe_str(row.get("keywords")),
    }


def _format_movies(df_slice) -> list:
    """Convert multiple DataFrame rows into a list of clean dicts."""
    return [_format_movie(row) for _, row in df_slice.iterrows()]