from fastapi import (
    APIRouter,
    UploadFile,
    File,
    BackgroundTasks,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session
from datetime import datetime
import cloudinary.uploader
import pdfplumber
import os
import traceback
import pymongo
import google.generativeai as genai
import json
from opensearchpy import OpenSearch
from app.config.postgres_config import get_db
from app.config.cloudinary_config import cloudinary
from app.config.postgres_config import SessionLocal
import re
from app.routes.resume_tasks import process_resume_task
from fastapi import Form
from app.models.application_resume import ApplicationResume

# from app.schemas import User
# from auth import get_current_user
from app.config.mongodb_config import resume_collection
from app.config.opensearch_config import opensearch_client

router = APIRouter()


from datetime import date

current_date = date.today().isoformat()


@router.post("/upload-resumes/")
def upload_resumes(
    job_id: int = Form(...),
    user_id: int = Form(...),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    failed_uploads = []
    success_uploads = []

    for file in files:
        try:
            # Upload to Cloudinary
            upload_result = cloudinary.uploader.upload(
                file.file, folder="resumes_tharshith"
            )
            cloudinary_url = upload_result["secure_url"]

            # Extract raw text
            file.file.seek(0)
            if file.filename.endswith(".pdf"):
                with pdfplumber.open(file.file) as pdf:
                    text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            else:
                raise ValueError("Only PDF files are supported right now")

            # Store raw in MongoDB
            resume_doc = {
                "uploader_id": str(user_id),
                "filename": file.filename,
                "uploaded_at": datetime.utcnow(),
                "cloudinary_url": cloudinary_url,
                "raw_text": text,
            }
            insert_result = resume_collection.insert_one(resume_doc)
            mongo_id = str(insert_result.inserted_id)

            # celery tasks
            process_resume_task.delay(
                raw_text=text,
                mongo_id=mongo_id,
                cloudinary_url=cloudinary_url,
                job_id=job_id,
            )

            success_uploads.append(file.filename)

        except Exception as e:
            traceback.print_exc()
            failed_uploads.append({"filename": file.filename, "error": str(e)})

    return {
        "message": "Resumes uploaded successfully (processing in background).",
        "success": success_uploads,
        "failed": failed_uploads,
    }


# Convert float experience to "X year Y months"
# def format_experience(exp_float: float) -> str:
#     total_months = round(exp_float * 12)
#     years = total_months // 12
#     months = total_months % 12
#     parts = []
#     if years > 0:
#         parts.append(f"{years} year{'s' if years != 1 else ''}")
#     if months > 0:
#         parts.append(f"{months} month{'s' if months != 1 else ''}")
#     return " ".join(parts) if parts else "0 months"


# def process_resume_task(raw_text, mongo_id, cloudinary_url, job_id):
#     print("came in ❌❌❌❌❌❌❌❌❌❌❌❌❌❌")
#     print("TYPE OF current_date:🫥🫥🫥🫥🫥", type(current_date))
#     print("VALUE OF current_date:🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️🤷‍♂️", current_date)
#     db = SessionLocal()
#     try:
#         prompt = f"""
#             You are an intelligent resume parsing system. Extract only the following structured information from the raw resume text provided:

#             1. **Name**
#             2. **Email**
#             3. **Phone number**
#             4. **LinkedIn URL**
#             5.College
#             6.branch
#             7. **Technical Skills** — Extract every word or phrase that represents a programming language, tool, software, framework, library, or technology. Include skills mentioned under experience, projects, certifications, publications, seminars, and anywhere else in the resume.
#             8. **Experience** — For each job:
#             - Extract role, company, start_date, end_date (or null), location, and responsibilities.
#             - Calculate **years_of_experience** as the difference between start_date and end_date.
#             - If "Present" or "Current" is used, use today's date: {current_date}

#             - If explicit total experience is written (e.g., "5 years of experience", "3+ years in Java"), extract all such durations and sum them into years_of_experience.

#             Return the data in this **JSON format**:
#             9. Location of the person : If prefered location is mentioned in the resume then add that location to the json otherwise add the location of the recent study like college location or school location

#             return like json {{    id: auto,----- these are not required
#                                         job_id: ------these are not required
#                                         person_name: ...,
#                                         email: ...,
#                                         linkedin_profile: ...,
#                                         college: ...,
#                                         branch: ...,
#                                         skills: [...],
#                                         location: ...,
#                                         experience: float,
#                                         cloudinary_url: ...,
#                                         mongo_id: ...,
#                                         opensearch_index: ...}}

#             # Notes:
#             - Do NOT include soft skills, education, summary, certifications, achievements, or anything else.
#             - You must focus only on name, phone, email, LinkedIn, technical_skills, and experience (with duration calculated precisely).
#             - For duration parsing:
#             - Subtract dates in YYYY-MM-DD format.
#             - If duration is written directly like "Worked for 2 years and 3 months", sum such durations too.
#             - Output a clean and compact JSON structure without comments.
#             - Be as accurate and exhaustive as possible when identifying technical skills from all parts of the resume.
#             - if no experienc is found return 0 years of experience and 0 months of internship and if only months are mentioned like oct-2022 to nov 2022 consider the difference between months
#             - the value of the total expereince should be in float like if the expereince is 1 year 2 months then change it to float value and return like 1 year = 12 and 2 months ==> 14 and then 14/12 = 1.1666666666666667 so return this value by rounding to 2 decimals like 1.17 and return like a float value
#             -Return JSON only. Do not use Markdown syntax (no ```json ... ```).

#             Resume:
#             ---
#             {raw_text}
#             ---
#                     """

#         response = model.generate_content(prompt)
#         print("👀👀👀👀👀👀👀 Gemini response.text:", repr(response.text))
#         # structured_data = json.loads(response.text)
#         cleaned_text = re.sub(r"^```json|```$", "", response.text.strip()).strip()

# # Optional: debug output
#         print("🧼 Cleaned Gemini JSON string:", cleaned_text)

# # Now parse safely
#         structured_data = json.loads(cleaned_text)
#         skills_list = structured_data.get("skills")
#         skills = ", ".join(skills_list) if isinstance(skills_list, list) else skills_list
#         # Store in PostgreSQL
#         resume_entry = ApplicationResume(
#             job_id=job_id,
#             person_name=structured_data.get("person_name"),
#             email=structured_data.get("email"),
#             linkedin_profile=structured_data.get("linkedin_profile"),
#             college=structured_data.get("college"),
#             branch=structured_data.get("branch"),
#             skills=skills,
#             location=structured_data.get("location"),
#             experience=structured_data.get("experience"),
#             cloudinary_url=cloudinary_url,
#             mongo_id=mongo_id,
#             opensearch_index="resumes_index"
#         )
#         db.add(resume_entry)
#         db.commit()
#         db.refresh(resume_entry)

#         formatted_experience = format_experience(resume_entry.experience)

#         # Store in OpenSearch
#         doc_id = str(resume_entry.id)
#         opensearch_client.index(
#             index="resumes_index",
#             id=doc_id,
#             body={
#                 "job_id": job_id,
#                 "person_name": resume_entry.person_name,
#                 "email": resume_entry.email,
#                 "skills": resume_entry.skills,
#                 "branch": resume_entry.branch,
#                 "location": resume_entry.location,
#                 "experience": formatted_experience,
#                 "mongo_id": mongo_id,
#                 "cloudinary_url": cloudinary_url,
#             }
#         )
#         print(f"📦 Indexed resume {doc_id} in OpenSearch.")

#     except Exception as e:
#         print(f"Error processing resume with mongo_id {mongo_id}: {e}")
#         traceback.print_exc()
