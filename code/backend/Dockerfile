# Use an Ubuntu base image with Python 3.11
FROM python:3.11-slim-bookworm

# Install system dependencies, including a newer GDAL
RUN apt-get update && apt-get install -y \
    libgdal-dev \
    gdal-bin \
    && apt-get clean

# Set environment variables for GDAL
ENV GDAL_VERSION=3.10.2
RUN pip install --no-cache-dir GDAL==3.10.2

# Set working directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your project
COPY . .

# Command to run your app (adjust as needed)
CMD ["gunicorn", "backend.wsgi:app", "--bind", "0.0.0.0:${PORT}"]
