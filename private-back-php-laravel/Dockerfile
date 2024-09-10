# Use the official NODE image
FROM node:20.17.0-alpine AS node

# Install system requirements
RUN apk update && apk add curl nano

# Set working directory
WORKDIR /app

# Copy the required minimum
COPY package*.json /app/

# Download all required NPM packages
RUN npm ci

# Copy over the project
COPY . .

# Build the front end part
RUN npm run build

# Use the official PHP image
FROM php:8.2-fpm-alpine

# Install system requirements
RUN apk update && apk add curl nano
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the existing application directory
COPY --chown=www-data:www-data . .
RUN mv .env.example .env

# Set defaults for the build
ARG APP_URL="http://localhost:8085"
ENV APP_URL=${APP_URL}

# Handle the frontend part
COPY --from=node /app/public/build /var/www/html/public/build

# Switch to the unprivileged user for running the app
USER www-data

# Install PHP dependencies with Composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Generate application key
RUN php artisan key:generate

# Expose app port to access the application
EXPOSE 8000

# Start app in the foreground
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
