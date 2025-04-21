from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.postgres_config import get_db
from app.config.opensearch_config import opensearch_client
from app.models.job_posting import Job
# utils/ner_extraction.py
import spacy
import re

nlp = spacy.load("en_core_web_sm")

def extract_fields_from_description(text: str):
    doc = nlp(text)
    skills = []
    experience = []
    location = []

    # You can tune these based on how your data is structured
    skill_keywords = {"python", "java", "c++", "sql", "react", "node", "docker"}  # Extend as needed
    for token in doc:
        if token.text.lower() in skill_keywords:
            skills.append(token.text.lower())

    for ent in doc.ents:
        if ent.label_ == "GPE":
            location.append(ent.text)
        if ent.label_ == "DATE":
            # Match patterns like "2+ years", "3 years", "mid-level"
            if re.search(r"\b\d+\+?\s*years?\b|\bmid[-\s]?level\b", ent.text.lower()):
                experience.append(ent.text)

    return {
        "skills": list(set(skills)),
        "experience": list(set(experience)),
        "location": list(set(location))
    }


router = APIRouter()

@router.get("/rank_candidates")
def rank_candidates(job_id: int, db: Session = Depends(get_db)):
    # 1. Fetch job description from PostgreSQL
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_description = job.description
    extracted = extract_fields_from_description(job_description)

    # 2. Search and rank resumes in OpenSearch using job description
    # query = {
    #     "size": 20,
    #     "query": {
    #         "multi_match": {
    #             "query": job_description,
    #             "fields": ["skills", "branch", "location", "experience"],
    #             "fuzziness": "AUTO"
    #         }
    #     },
    #     "sort": [
    #         {"_score": {"order": "desc"}}
    #     ]
    # }
     # 2. Search only resumes related to this job_id and rank them
    query = {
        "size": 20,
        "query": {
            "bool": {
                "must": [
                    {
                        "multi_match": {
                            "query": job_description,
                            "fields": ["skills", "branch", "location", "experience"],
                            "fuzziness": "AUTO"
                        }
                    }
                ],
                "filter": [
                    { "term": { "job_id": job_id } }
                ]
            }
        },
        "sort": [
            {"_score": {"order": "desc"}}
        ]
    }

    response = opensearch_client.search(index="resumes_index", body=query)

    ranked_candidates = []
    for hit in response["hits"]["hits"]:
        source = hit["_source"]
        source["score"] = hit["_score"]  # Attach score for transparency
        ranked_candidates.append(source)

    return {
        "job_id": job_id,
        "job_title": job.job_name,
        "matched_candidates": ranked_candidates
    }
    # skills = extracted["skills"]
    # experience = extracted["experience"]
    # location = extracted["location"]

    # should_clauses = []

    # for skill in skills:
    #     should_clauses.append({
    #         "match": {
    #             "skills": {
    #                 "query": skill,
    #                 "boost": 3
    #             }
    #         }
    #     })

    # for exp in experience:
    #     should_clauses.append({
    #         "match": {
    #             "experience": {
    #                 "query": exp,
    #                 "boost": 2
    #             }
    #         }
    #     })

    # for loc in location:
    #     should_clauses.append({
    #         "match": {
    #             "location": {
    #                 "query": loc,
    #                 "boost": 1
    #             }
    #         }
    #     })

    # query = {
    #     "size": 20,
    #     "query": {
    #         "bool": {
    #             "should": should_clauses,
    #             "filter": [
    #                 { "term": { "job_id": job_id } }
    #             ]
    #         }
    #     },
    #     "sort": [
    #         {"_score": {"order": "desc"}}
    #     ]
    # }

    # response = opensearch_client.search(index="resumes_index", body=query)

    # hits = response["hits"]["hits"]
    # if not hits:
    #     return {
    #         "job_id": job_id,
    #         "job_title": job.job_name,
    #         "matched_candidates": []
    #     }

    # max_score = hits[0]["_score"]

    # ranked_candidates = []
    # for hit in hits:
    #     source = hit["_source"]
    #     raw_score = hit["_score"]
    #     norm_score = round((raw_score / max_score) * 100, 2)
    #     source["match_percentage"] = f"{norm_score}%"
    #     ranked_candidates.append(source)

    # return {
    #     "job_id": job_id,
    #     "job_title": job.job_name,
    #     "matched_candidates": ranked_candidates
    # }
