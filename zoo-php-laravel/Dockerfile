# Use the official PHP image
FROM php:8.3.13-fpm

# Install System packages
RUN apt update && apt install -y \
    bash \
    curl \
    default-mysql-client \
    fcgiwrap \
    iputils-ping \
    git \
    jq \
    nano \
    telnet \
    zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql \
    && pecl install redis apcu \
    && docker-php-ext-enable redis apcu \
    && docker-php-source delete \
    && rm -rf /tmp/* /var/tmp/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy custom PHP-FPM configurations
COPY ./php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY ./php-fpm/zz-docker.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY ./php-fpm/docker.conf /usr/local/etc/php-fpm.d/docker.conf

# Copy custom PHP configurations
COPY ./php-fpm/php.ini /usr/local/etc/php/php.ini

# Add APCu configuration
RUN echo "apc.enable_cli=1" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini \
    && echo "apc.shm_size=32M" >> /usr/local/etc/php/conf.d/docker-php-ext-apcu.ini

# Copy the mysql-wait.sh script
COPY --chown=www-data:www-data ./php-fpm/mysql-wait.sh /mysql-wait.sh
RUN chmod +x /mysql-wait.sh

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
EXPOSE 8003/tcp

# Start app in the foreground
CMD ["php-fpm"]
