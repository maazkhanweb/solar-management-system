FROM composer:2 AS composer

WORKDIR /app

COPY solar-management-api/composer.json solar-management-api/composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

COPY solar-management-api/ ./
RUN composer dump-autoload --optimize --no-dev


FROM node:22-alpine AS frontend

WORKDIR /app

COPY solar-management-api/package.json solar-management-api/package-lock.json* ./
RUN npm install

COPY solar-management-api/resources ./resources
COPY solar-management-api/vite.config.js ./
COPY solar-management-api/public ./public

RUN npm run build


FROM php:8.3-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libicu-dev \
    libonig-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install \
    pdo_pgsql \
    mbstring \
    bcmath \
    intl \
    zip \
    && a2enmod rewrite \
    && sed -ri -e 's!/var/www/html!/var/www/html/public!g' \
       /etc/apache2/sites-available/*.conf \
       /etc/apache2/apache2.conf \
       /etc/apache2/conf-available/*.conf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=composer /app ./
COPY --from=frontend /app/public/build ./public/build

RUN mkdir -p storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

RUN php artisan storage:link || true

EXPOSE 80

CMD ["apache2-foreground"]



