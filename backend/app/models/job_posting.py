from sqlalchemy import Column, Integer, String, ForeignKey
from app.config.postgres_config import Base
from sqlalchemy.orm import relationship


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_name = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(String, nullable=False)
    posted_by = Column(String, nullable=False)  # could be email or user ID

    resumes = relationship("ApplicationResume", back_populates="job")


# ✅ Add this AFTER the class
from app.models.application_resume import ApplicationResume
