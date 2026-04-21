#!/bin/sh
set -e

# Run only on the main app container, not reverb/queue
if [ "$1" = "php-fpm" ]; then
    php artisan storage:link --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan migrate --force
fi

exec "$@"
