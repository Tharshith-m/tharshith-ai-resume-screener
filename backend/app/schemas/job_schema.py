from pydantic import BaseModel, EmailStr


class JobCreate(BaseModel):
    email: EmailStr  # email of the user posting the job
    job_name: str
    description: str
