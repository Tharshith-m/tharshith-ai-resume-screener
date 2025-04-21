from app.config.postgres_config import Base, engine
# from app.models import user, application_resume , job_posting
from app.models.job_posting import Job
from app.models.application_resume import ApplicationResume
from app.models.user import User
import logging


logger = logging.getLogger(__name__)

def init_db():
    try:
        print("📦 Starting table creation...")
        logger.info("📦 Starting table creation...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ All tables created. 1️⃣")
        print("🎉 All tables created successfully!")
        logger.info("✅ All tables created.2️⃣")
    except Exception as e:
        print("Error creating tables:", e)

if __name__ == "__main__":
    init_db()