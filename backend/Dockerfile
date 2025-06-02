# Use official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . .

# Set static files path
ENV DJANGO_SETTINGS_MODULE=budget_project.settings
RUN mkdir -p /app/staticfiles
RUN python manage.py collectstatic --noinput

# Expose port (Cloud Run default)
EXPOSE 8080

# Run the app with Gunicorn
CMD ["gunicorn", "budget_project.wsgi:application", "--bind", "0.0.0.0:8080"]
