# Use a Python base image that matches your Django project's requirements
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install system dependencies required for GDAL
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Set GDAL_LIBRARY_PATH and other GDAL environment variables. This is crucial!
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal
ENV LIBRARY_PATH=/usr/lib
ENV GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu

# Copy your Django project into the container
COPY . .

# Expose the port your Django application runs on (typically 8000)
EXPOSE 8000

# Run the Django application
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"] #Replace your_project_name

# If you need to run migrations, add the following line before the CMD
# RUN python manage.py migrate