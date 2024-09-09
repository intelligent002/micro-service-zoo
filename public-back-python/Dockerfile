# Use an official Python runtime as a parent image
FROM python:3.12.5-alpine3.20

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
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project into app
COPY flask_graphql_api/ /app

# Expose the Flask port (8001)
EXPOSE 8001

# Command to run the Flask application
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8001", "app:app"]

