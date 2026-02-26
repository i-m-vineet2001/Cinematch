# # Your existing recommend() logic
# # engine/recommender.py
# # ─────────────────────────────────────────────
# # Core ML recommendation engine
# # Uses CountVectorizer + Cosine Similarity
# # This runs ONCE on startup and stays in memory — fast for API calls
# # ─────────────────────────────────────────────

# import os
# import pandas as pd
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# # ── Load Dataset ──────────────────────────────
# DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/movie_dataset.csv")
# df = pd.read_csv(DATA_PATH)

# # ── Prepare Features ──────────────────────────
# features = ["keywords", "cast", "genres", "director"]
# for feature in features:
#     df[feature] = df[feature].fillna("")


# def combine_features(row):
#     """Merge all feature columns into one string for vectorization."""
#     try:
#         return (
#             row["keywords"] + " " +
#             row["cast"] + " " +
#             row["genres"] + " " +
#             row["director"]
#         )
#     except Exception as e:
#         print(f"Error combining features: {e}")
#         return ""

# df["combined_features"] = df.apply(combine_features, axis=1)

# # ── Build Similarity Matrix (runs once on import) ──
# # CountVectorizer converts text → word count matrix
# # cosine_similarity computes similarity between every pair of movies
# vectorizer = CountVectorizer()
# count_matrix = vectorizer.fit_transform(df["combined_features"])
# cosine_sim = cosine_similarity(count_matrix)


# # ── Helper Functions ──────────────────────────

# def get_title_from_index(index: int) -> str:
#     """Return movie title for a given DataFrame index."""
#     return df[df.index == index]["title"].values[0]


# def get_index_from_title(title: str) -> int:
#     """Return DataFrame index for a given title (case-insensitive)."""
#     result = df[df.title.str.lower() == title.lower()]["index"]
#     if result.empty:
#         raise ValueError(f"Movie '{title}' not found in the dataset.")
#     return result.values[0]


# # ── Main Recommend Function ───────────────────

# def recommend(movie_title: str, top_n: int = 10) -> list:
#     """
#     Returns top N similar movies as a list of dicts.
#     Each dict has: title, similarity_score

#     Example:
#         recommend("Avatar", top_n=5)
#         → [{"title": "Aliens", "similarity_score": 0.37}, ...]
#     """
#     try:
#         idx = get_index_from_title(movie_title)
#     except ValueError as e:
#         raise ValueError(str(e))

#     # Pair every movie index with its similarity score to our movie
#     similar_movies = sorted(
#         enumerate(cosine_sim[idx]), key=lambda x: x[1], reverse=True
#     )

#     recommendations = []
#     for movie_idx, score in similar_movies:
#         if movie_idx == idx:
#             continue  # Skip the input movie itself
#         recommendations.append(
#             {
#                 "title": get_title_from_index(movie_idx),
#                 "similarity_score": round(float(score), 4),
#             }
#         )
#         if len(recommendations) >= top_n:
#             break

#     return recommendations








# engine/recommender.py
# ─────────────────────────────────────────────
# Core ML recommendation engine
# Uses CountVectorizer + Cosine Similarity
# Poster URLs fetched in parallel batch for speed
# ─────────────────────────────────────────────

import os
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from engine.tmdb import get_poster_urls_batch

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/movie_dataset.csv")
df = pd.read_csv(DATA_PATH)

# ── Prepare Features ──────────────────────────
features = ["keywords", "cast", "genres", "director"]
for feature in features:
    df[feature] = df[feature].fillna("")


def combine_features(row):
    try:
        return (
            row["keywords"]
            + " "
            + row["cast"]
            + " "
            + row["genres"]
            + " "
            + row["director"]
        )
    except Exception as e:
        print(f"Error combining features: {e}")
        return ""


df["combined_features"] = df.apply(combine_features, axis=1)

# ── Build Similarity Matrix (runs once on import) ──
vectorizer = CountVectorizer()
count_matrix = vectorizer.fit_transform(df["combined_features"])
cosine_sim = cosine_similarity(count_matrix)


# ── Helpers ───────────────────────────────────


def get_title_from_index(index: int) -> str:
    return df[df.index == index]["title"].values[0]


def get_index_from_title(title: str) -> int:
    result = df[df.title.str.lower() == title.lower()]["index"]
    if result.empty:
        raise ValueError(f"Movie '{title}' not found in the dataset.")
    return result.values[0]


# ── Main Recommend Function ───────────────────


def recommend(movie_title: str, top_n: int = 10) -> list:
    """
    Returns top N similar movies as a list of dicts.
    Poster URLs fetched in one parallel batch at the end — fast!
    """
    try:
        idx = get_index_from_title(movie_title)
    except ValueError as e:
        raise ValueError(str(e))

    similar_movies = sorted(
        enumerate(cosine_sim[idx]), key=lambda x: x[1], reverse=True
    )

    # Collect top N titles first
    rec_list = []
    for movie_idx, score in similar_movies:
        if movie_idx == idx:
            continue
        rec_list.append(
            {
                "title": get_title_from_index(movie_idx),
                "similarity_score": round(float(score), 4),
            }
        )
        if len(rec_list) >= top_n:
            break

    # Fetch all poster URLs in one parallel batch
    titles = [r["title"] for r in rec_list]
    posters = get_poster_urls_batch(titles)

    # Attach poster URLs to results
    for rec in rec_list:
        rec["poster_url"] = posters.get(rec["title"], "")

    return rec_list