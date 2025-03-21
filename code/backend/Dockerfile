# Use Ubuntu 22.04 as base image
FROM ubuntu:22.04

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    python3-pip \
    libpq-dev \
    # GDAL dependencies
    libgdal-dev \
    gdal-bin \
    # Other useful utilities
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set specific GDAL version
ENV GDAL_VERSION=3.6.2

RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    && rm -rf /var/lib/apt/lists/*

ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

RUN pip install --upgrade pip setuptools wheel
RUN pip install numpy  # Ensure numpy is installed first

# Install Python packages
RUN pip install --upgrade pip setuptools wheel

# Set working directory
WORKDIR /app

# Copy requirements file (assuming you have one)
COPY requirements.txt .

# Install Python dependencies including GDAL
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port (Render defaults to 10000)
EXPOSE 10000

# Run Django application
CMD ["gunicorn", "--bind", "0.0.0.0:10000", "backend.wsgi"]