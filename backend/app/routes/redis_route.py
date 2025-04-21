# # Add this to your FastAPI backend
# from fastapi import APIRouter
# from app.config.redis_config import redis_client

# router = APIRouter()
# @router.get("/cached-searches")
# def get_cached_search_terms():
#     keys = redis_client.keys("candidate_search:*")
#     search_terms = []

#     for key in keys:
#         decoded = key.decode()
#         parts = decoded.split(":")[1]  # Get MD5 hash
#         # Optionally: you could store raw terms as value too for better parsing
#         search_terms.append(decoded)

#     return {"cached_keys": search_terms}


# app/routes/redis_routes.py

from fastapi import APIRouter
from urllib.parse import quote
from app.config.redis_config import redis_client  # ✅ Reuse existing redis_client

router = APIRouter()


# 🔁 Function to store readable search terms
def cache_search_query(skills: str, location: str, experience: str):
    key = f"candidate_search:Skills={skills}|Location={location}|Experience={experience}"
    
    # Optional: make key URL-safe (not required unless keys have spaces or special chars)
    safe_key = quote(key, safe='')  # You can skip this line if not using unsafe characters

    redis_client.setex(key, 3600, "")  # Store key for 1 hour


# 📥 Endpoint to return all cached readable search terms
@router.get("/cached-searches")
def get_cached_search_terms():
    keys = redis_client.keys("candidate_search:*")
    readable_filters = []

    for key in keys:
        print(f"DEBUG key from Redis: {key}")
        clean = key.replace("candidate_search:", "")
        parts = clean.split("|")
        filter_obj = {}

        for part in parts:
            if "=" in part:
                k, v = part.split("=", 1)
                filter_obj[k] = v

        readable_filters.append(filter_obj)

    return {"filters": readable_filters}
