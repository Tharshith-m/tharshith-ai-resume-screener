from fastapi import FastAPI, HTTPException, Query
from opensearchpy import OpenSearch
from app.config.opensearch_config import (
    opensearch_client as client,
)  # Assuming you have a config file for OpenSearch client
from typing import Optional
from fastapi import APIRouter

# app = FastAPI()
router = APIRouter()


INDEX_NAME = "resumes_index"


@router.get("/resume/by-email")
async def get_resume_by_email(email: str = Query(..., example="someone@example.com")):
    try:
        print(f"Searching for resume with email⛔⛔⛔⛔⛔⛔⛔⛔⛔: {email}")
        # Search by email
        query = {"query": {"term": {"email.keyword": email}}}

        response = client.search(index=INDEX_NAME, body=query)
        print(f"OpenSearch response: {response}")
        if response["hits"]["total"]["value"] == 0:
            raise HTTPException(
                status_code=404, detail="No resume found for this email."
            )

        # Return all matched resumes (you can limit if needed)
        return {"results": [hit["_source"] for hit in response["hits"]["hits"]]}

    except HTTPException as http_error:
        # Handle specific HTTP exceptions
        print(f"HTTP error occurred: {http_error.detail}")
        raise http_error

    except Exception as e:
        print(f"Unexpected error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
