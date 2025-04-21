from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.postgres_config import get_db
from app.models.job_posting import Job
from app.models.user import User
from app.schemas.job_schema import JobCreate

router = APIRouter()

@router.post("/post-job")
def post_job(job: JobCreate, db: Session = Depends(get_db)):
    # Find the user posting this job (based on email)
    user = db.query(User).filter(User.email == job.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_job = Job(
        job_name=job.job_name,
        company=user.company,
        description=job.description,
        posted_by=user.name
    )
# with this line it would know that the job is posted by the user
    db.add(new_job)
    #  this adds the data into the database
    db.commit()
    db.refresh(new_job)

    return {
        "message": "Job posted successfully",
        "job_id": new_job.id,
        "posted_by": new_job.posted_by,
        "company": new_job.company
    }
