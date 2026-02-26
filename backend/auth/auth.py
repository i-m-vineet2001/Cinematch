# Login/Signup logic

# auth/auth.py
# ─────────────────────────────────────────────
# Core authentication logic
# Handles: signup, login, JWT token creation & verification
# ─────────────────────────────────────────────

import json
import os
from datetime import datetime, timedelta
from jose import jwt,JWTError
from auth.hashing import hash_password, verify_password

# ── Config ────────────────────────────────────
# SECRET_KEY is used to sign JWT tokens — keep this private in production
SECRET_KEY = "cinematchkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Path to users.json — where all user data is stored
USER_FILE = os.path.join(os.path.dirname(__file__),"../data/users.json ")


# ── File Helpers ──────────────────────────────
def load_users()-> dict:
    """Load all users from users.json. Returns empty dict if file missing."""
    if not os.path.exists(USER_FILE):
        return {}
    with open(USER_FILE, "r") as f:
        return json.load(f)

def save_users(users:dict):
    """Save the full users dict back to users.json."""
    with open(USER_FILE, "w") as f:
        json.dump(users,f,indent = 4)

# ── Signup ────────────────────────────────────
def signup_user(username:str,password:str)->dict:
    """
    Register a new user.
    Returns success message or raises error if username already exists.
    """
    users = load_users()

    # Check if username is already taken
    if username in users:
        raise ValueError("Username alredy exist")

    # Store new user with hashed password and empty history/favourites
    users[username] = {
    "password": hash_password(password),
    "created_at": datetime.now().isoformat(),
    "favourites": [],  # list of movie titles
    "recommendation_history": [],  # list of {movie, recommendations, timestamp}
    }
    save_users(users)
    return {"message": f"User '{username}' created successfully."}

# ── Login ─────────────────────────────────────
def login_user(username:str,password:str)->dict:
    """
    Verify credentials and return a JWT access token if valid.
    Raises ValueError if username not found or password is wrong.
    """
    users = load_users()

    # Check if user exists
    if username not in users:
        raise ValueError("Invalid username or password")

    # Verify password against stored hash
    if not verify_password(password,users[username]["password"]):
        raise ValueError("Invalid username or password")
    
    # Create and return JWT token
    return create_access_token({"sub": username})


# ── JWT Token ─────────────────────────────────
def create_access_token(data:dict)-> str:
    """
    Create a signed JWT token.
    'sub' (subject) = username
    Token expires after ACCESS_TOKEN_EXPIRE_MINUTES
    """

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token:str)->dict:
    """
    Decode and verify a JWT token.
    Returns the username if valid, raises JWTError if not.
    """
    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise JWTError("Invalid token.")
        return username
    except JWTError:
        raise JWTError("Token is invalid or expired.")