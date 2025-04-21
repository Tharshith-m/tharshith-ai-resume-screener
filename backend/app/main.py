from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.routes import register , login , job_postings , upload_resume , rank_candidates , search_resume , redis_route , opensearch_route
from app.db_init import init_db
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now, or use ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# init_db()  # Will run at startup
@app.on_event("startup")
def on_startup():
    print("🔧 FastAPI is starting...")
    init_db()


app.include_router(register.router)
app.include_router(login.router)
app.include_router(job_postings.router)
app.include_router(upload_resume.router)
app.include_router(rank_candidates.router)
app.include_router(search_resume.router)
app.include_router(redis_route.router)
app.include_router(opensearch_route.router)

logging.basicConfig(level=logging.INFO)
