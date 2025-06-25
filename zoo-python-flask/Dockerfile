# Use an official Python runtime as a parent image
FROM python:3.12.5-alpine3.20

# Install system requirements
RUN apk update && apk add --no-cache \
    curl \
    jq \
    nano \
    wget \
    && rm -rf /var/cache/apk/* /tmp/*

# Create the www-data user and group if they don't already exist
RUN adduser -u 82 -D -S -G www-data www-data

# Switch to the non-root user
USER www-data

# Add the user's local bin to PATH
ENV PATH="/home/www-data/.local/bin:$PATH"

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -rf /tmp/* /var/tmp/*

# Copy the project into app
COPY app /app/app
COPY main.py /app

# Expose the Flask port (8001)
EXPOSE 8001/tcp

# Command to run the Flask application
CMD ["sh","-c","gunicorn -w ${APP_WORKERS:-1} -b 0.0.0.0:${APP_PORT:-8001} main:app"]

