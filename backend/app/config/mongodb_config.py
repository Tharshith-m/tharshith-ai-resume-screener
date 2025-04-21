from pymongo import MongoClient

# MongoDB connection
mongo_client = MongoClient("mongodb://mongo:27017/")
mongo_db = mongo_client["resume_db"]
resume_collection = mongo_db["resumes"]
