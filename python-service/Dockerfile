# Use official Python 3.13 image
FROM python:3.13-slim

# Set working directory inside container
WORKDIR /python-service

# Copy requirements first (for caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI with Uvicorn
CMD ["uvicorn", "chatbot:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]