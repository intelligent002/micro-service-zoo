# Use the official PHP image
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk update && apk add curl nano jq fcgi
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy custom PHP-FPM and PHP configurations
COPY ./php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./php-fpm/docker.conf /usr/local/etc/php-fpm.d/docker.conf
COPY ./php-fpm/php.ini /usr/local/etc/php/php.ini

# Set working directory
WORKDIR /var/www/html

# Copy the existing application directory
COPY --chown=www-data:www-data . .
RUN mv .env.example.docker .env

# Switch to the unprivileged user for running the app
USER www-data

# Install PHP dependencies with Composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Generate application key
RUN php artisan key:generate

# Expose app port to access the application
EXPOSE 9000

# Start app in the foreground
CMD ["php-fpm"]
