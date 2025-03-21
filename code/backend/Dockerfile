# # Use an Ubuntu base image with Python 3.11
# FROM python:3.11-slim-bookworm

# # Install system dependencies, including a newer GDAL
# RUN apt-get update && apt-get install -y \
#     libgdal-dev \
#     gdal-bin \
#     && apt-get clean

# # Set environment variables for GDAL
# ENV GDAL_VERSION=3.10.2
# RUN pip install --no-cache-dir GDAL==3.10.2

# # Set working directory
# WORKDIR /app

# # Copy requirements and install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy your project
# COPY . .

# # Command to run your app (adjust as needed)
# CMD ["gunicorn", "backend.wsgi:app", "--bind", "0.0.0.0:${PORT}"]

# Use a base Python image
FROM python:3.9

# Install Conda
RUN conda install -n base -c conda-forge conda mamba

# Create a dedicated environment
RUN conda create -n gdal_master_env python=3.9 -c conda-forge

# Activate the environment
SHELL ["conda", "run", "-n", "gdal_master_env", "bash", "-c"]

# Install GDAL from gdal-master channel
RUN mamba install -c gdal-master gdal

# Optional: Install Arrow and Parquet drivers
#RUN mamba install -c gdal-master libgdal-arrow-parquet

# Set working directory
WORKDIR /app

# Copy your application code
COPY . .

# (Optional) Install any other dependencies
#RUN pip install -r requirements.txt
