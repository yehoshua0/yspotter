# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables to prevent interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory
WORKDIR /app

# Install system dependencies for GDAL and other required libraries
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-dev \
    build-essential \
    && apt-get clean

# Set the GDAL environment variable to match the installed version
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Set the default command
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:api"]