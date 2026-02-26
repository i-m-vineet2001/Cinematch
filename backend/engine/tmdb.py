# engine/tmdb.py
# ─────────────────────────────────────────────
# TMDB API integration — fetches movie poster URLs
# - Parallel fetching using ThreadPoolExecutor (much faster)
# - 10 second timeout with 3 retries
# - In-memory cache so each movie is only fetched once
# ─────────────────────────────────────────────

import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500"
TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie"

# ── Config ────────────────────────────────────
TIMEOUT = 10  # seconds per request
MAX_RETRIES = 3  # retry attempts on timeout
RETRY_DELAY = 1  # seconds between retries
MAX_WORKERS = 10  # parallel threads for batch fetching

# ── In-memory cache ───────────────────────────
_poster_cache: dict = {}


def get_poster_url(title: str) -> str:
    """
    Fetch poster URL for a single movie title from TMDB.
    Returns full image URL or "" if not found.
    Results are cached so same movie is never fetched twice.
    """
    if title in _poster_cache:
        return _poster_cache[title]

    last_error = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = requests.get(
                TMDB_SEARCH_URL,
                params={
                    "api_key": TMDB_API_KEY,
                    "query": title,
                    "language": "en-US",
                    "page": 1,
                },
                timeout=TIMEOUT,
            )
            data = response.json()
            results = data.get("results", [])

            poster_url = (
                TMDB_IMAGE_BASE + results[0]["poster_path"]
                if results and results[0].get("poster_path")
                else ""
            )

            _poster_cache[title] = poster_url
            return poster_url

        except requests.exceptions.Timeout as e:
            last_error = e
            print(f"TMDB timeout for '{title}' — attempt {attempt}/{MAX_RETRIES}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)

        except requests.exceptions.ConnectionError as e:
            last_error = e
            print(
                f"TMDB connection error for '{title}' — attempt {attempt}/{MAX_RETRIES}"
            )
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)

        except Exception as e:
            print(f"TMDB unexpected error for '{title}': {e}")
            _poster_cache[title] = ""
            return ""

    print(f"TMDB failed for '{title}' after {MAX_RETRIES} attempts: {last_error}")
    _poster_cache[title] = ""
    return ""


def get_poster_urls_batch(titles: list) -> dict:
    """
    Fetch poster URLs for multiple movies IN PARALLEL.
    10x faster than fetching one by one.

    Usage:
        posters = get_poster_urls_batch(["Avatar", "Iron Man", "Inception"])
        → {"Avatar": "https://...", "Iron Man": "https://...", ...}
    """
    # Filter out already cached titles — no need to fetch again
    uncached = [t for t in titles if t not in _poster_cache]

    if uncached:
        # Fetch all uncached titles in parallel using thread pool
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {
                executor.submit(get_poster_url, title): title for title in uncached
            }
            for future in as_completed(futures):
                pass  # Results are saved to cache inside get_poster_url

    # Return all results from cache
    return {title: _poster_cache.get(title, "") for title in titles}
