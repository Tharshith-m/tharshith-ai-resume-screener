from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# PostgreSQL config from docker-compose environment
POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "resumes"
POSTGRES_HOST = "postgres"
POSTGRES_PORT = "5432"

# Connection URL
DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for ORM models
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional test
def test_connection():
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        print("✅ PostgreSQL connected successfully!")
    except Exception as e:
        print("❌ PostgreSQL connection failed:", e)

if __name__ == "__main__":
    test_connection()
