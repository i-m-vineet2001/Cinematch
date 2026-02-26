# SHA256 password hashing

import hashlib

def hash_password(password: str)->str:
    """
        Takes a plain text password and returns its SHA256 hash.
    Example: hash_password("mypassword") → "89e01536ac...
    """
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str,hashed_password: str)-> bool:
    """
    Hashes the incoming plain password and compares it
    to the stored hash. Returns True if they match.
    """
    return hash_password(plain_password)==hashed_password