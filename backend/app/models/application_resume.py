from sqlalchemy import Column, Integer, String, ForeignKey , Float
from app.config.postgres_config import Base
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
class ApplicationResume(Base):
    __tablename__ = "application_resumes"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id") , nullable=False)
    person_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    linkedin_profile = Column(String)
    college = Column(String)
    branch = Column(String)
    skills = Column(String)
    location = Column(String)
    experience = Column(Float)
    cloudinary_url = Column(String)
    mongo_id = Column(String)
    opensearch_index = Column(String)
    job = relationship("Job", back_populates="resumes")

# ✅ Add this at the bottom to resolve the "Job" reference
# from app.models.job_posting import Job