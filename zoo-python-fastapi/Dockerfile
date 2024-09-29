# Use an official Python runtime as a parent image
FROM docker.artifactory.intel.r7g.org/python:3.12.5-alpine3.20

# Install system requirements
RUN apk update && apk add --no-cache curl jq nano

# Create the www-data user and group if they don't already exist
RUN adduser -u 82 -D -S -G www-data www-data

# Switch to the non-root user
USER www-data

# Add the user's local bin to PATH
ENV PATH="/home/www-data/.local/bin:$PATH"

# Set the working directory inside the container
WORKDIR /fastapi

# Set the PYTHONPATH to ensure `app` is recognized as a package
ENV PYTHONPATH=/fastapi

# Copy the requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy over the alembic
COPY app/alembic /fastapi/alembic
COPY alembic.ini /fastapi/

# Copy over the project
COPY app /fastapi/app

# Expose the Flask port (8001)
EXPOSE 8001/tcp

# Command to run the Flask application
CMD ["sh","-c","uvicorn --workers ${APP_WORKERS:-1} --host 0.0.0.0 --port ${APP_PORT:-8001} app.main:app"]

