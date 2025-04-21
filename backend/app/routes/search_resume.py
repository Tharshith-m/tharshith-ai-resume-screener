

import re
import json
import hashlib
import nltk
from typing import Optional
from fastapi import APIRouter, Query, HTTPException
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer

from app.config.opensearch_config import opensearch_client
from app.config.redis_config import redis_client

nltk.download('stopwords')

router = APIRouter()

# Skill and location synonym maps
SKILL_SYNONYMS = {
    "js": "javascript", "py": "python", "tf": "tensorflow",
    "ml": "machine learning", "rdbms": "database management",
    "node": "nodejs"
}

LOCATION_SYNONYMS = {
    "hyd": "hyderabad", "cbit": "hyderabad", "delhi": "new delhi"
}

# Convert experience strings like '3 years' to months
def experience_to_months(exp_str: str) -> float:
    if not exp_str:
        return 0.0
    match = re.match(r"(\d+)\s*(year|month|years|months)?", exp_str.lower())
    if match:
        value = int(match.group(1))
        unit = match.group(2)
        return value * 12 if unit and "year" in unit else value
    return 0.0

# Normalize terms using synonym maps
def normalize_term(term: str, mapping: dict) -> str:
    return mapping.get(term.strip().lower(), term.strip().lower())

# Compute similarity score using TF-IDF
def compute_tfidf_score(query: str, documents: list[str]) -> list[float]:
    vectorizer = TfidfVectorizer(stop_words=stopwords.words('english'))
    vectors = vectorizer.fit_transform([query] + documents)
    return (vectors[0] @ vectors[1:].T).toarray()[0]

# Generate cache key
def generate_cache_key(job_id, skills, location, experience):
    raw_key = f"{job_id}|{skills or ''}|{location or ''}|{experience or ''}"
    return f"candidate_search:{hashlib.md5(raw_key.encode()).hexdigest()}"

# Main endpoint
@router.get("/candidates")
def search_candidates(
    job_id: int,
    skills: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    experience: Optional[float] = Query(None)  # in months
):
    if not any([skills, location, experience]):
        raise HTTPException(status_code=400, detail="At least one filter (skills, location, experience) must be provided.")

    cache_key = generate_cache_key(job_id, skills, location, experience)
    cached_result = redis_client.get(cache_key)
    if cached_result:
        return json.loads(cached_result)

    # Store search query for UI (readable key)
    readable_key = f"candidate_search:Skills={skills or 'Any'}|Location={location or 'Any'}|Experience={experience or 'Any'}"
    redis_client.setex(readable_key, 3600, "")

    # Build OpenSearch query
    base_query = {"bool": {"must": [{"term": {"job_id": job_id}}]}}

    if location:
        base_query["bool"]["must"].append({
            "match": {"location": {"query": normalize_term(location, LOCATION_SYNONYMS), "fuzziness": "AUTO"}}
        })

    if skills:
        normalized = " ".join([normalize_term(s, SKILL_SYNONYMS) for s in skills.split(",")])
        base_query["bool"]["must"].append({
            "match": {"skills": {"query": normalized, "fuzziness": "AUTO"}}
        })

    query = {"size": 1000, "query": base_query}
    response = opensearch_client.search(index="resumes_index", body=query)
    candidates = [hit["_source"] for hit in response["hits"]["hits"]]

    # Experience filtering
    if experience is not None:
        candidates = [
            c for c in candidates
            if experience_to_months(c.get("experience", "0 months")) >= experience
        ]

    # TF-IDF re-ranking if skills present
    if skills:
        query_skills = " ".join([normalize_term(s, SKILL_SYNONYMS) for s in skills.split(",")])
        doc_skills = [
            " ".join([normalize_term(s, SKILL_SYNONYMS) for s in c.get("skills", "").split(",")])
            for c in candidates
        ]
        tfidf_scores = compute_tfidf_score(query_skills, doc_skills)

        # Attach scores and sort
        ranked_candidates = []
        for c, score in zip(candidates, tfidf_scores):
            if score > 0:
                c["tfidf_score"] = round(score, 4)
                ranked_candidates.append(c)

        candidates = sorted(ranked_candidates, key=lambda x: x["tfidf_score"], reverse=True)

    # Attach experience in months
    for c in candidates:
        c["experience_months"] = experience_to_months(c.get("experience", "0 months"))

    result = {"matched_count": len(candidates), "results": candidates}
    redis_client.setex(cache_key, 600, json.dumps(result))  # Cache for 10 mins

    return result


