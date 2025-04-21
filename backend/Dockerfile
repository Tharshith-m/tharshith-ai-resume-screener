# # Use official Python image
# FROM python:3.10

# # Set working directory
# WORKDIR /app

# # Copy files
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy app source
# COPY app/ ./app/

# # command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload


# # Expose API port
# EXPOSE 8000

# # Run the API
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" , "--reload"]
# Use official Python image
FROM python:3.10

# Set working directory
WORKDIR /app

# Install system dependencies (for spaCy & pip packages that need compilation)
RUN apt-get update && apt-get install -y gcc

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy English model
RUN python -m spacy download en_core_web_sm

# Copy app source code
COPY app/ ./app/

# Expose API port
EXPOSE 8000

# Run the FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
