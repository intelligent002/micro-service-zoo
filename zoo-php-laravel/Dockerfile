# Use the official PHP image
FROM docker.artifactory.intel.r7g.org/php:8.2-fpm

# Install System packages
RUN apt update && apt install -y curl jq fcgiwrap nano default-mysql-client

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Install Composer
COPY --from=docker.artifactory.intel.r7g.org/composer:latest /usr/bin/composer /usr/bin/composer

# Copy custom PHP-FPM configurations
COPY ./php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./php-fpm/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY ./php-fpm/docker.conf /usr/local/etc/php-fpm.d/docker.conf

# Copy custom PHP configurations
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
