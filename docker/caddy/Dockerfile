# Stage 1: build frontend assets (mirrors the app Dockerfile so the web
# container can serve the exact same built assets).
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# .env is .dockerignore'd, so the public VITE_* vars must be passed in at build
# time, otherwise the compiled JS falls back to localhost/ws:// and Reverb breaks.
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME
ENV VITE_REVERB_APP_KEY=$VITE_REVERB_APP_KEY \
    VITE_REVERB_HOST=$VITE_REVERB_HOST \
    VITE_REVERB_PORT=$VITE_REVERB_PORT \
    VITE_REVERB_SCHEME=$VITE_REVERB_SCHEME
RUN npm run build

# Stage 2: Caddy web server with the built public/ baked in at the same
# path the app container uses (/var/www/html/public), so php_fastcgi
# SCRIPT_FILENAME paths line up between this container and PHP-FPM.
FROM caddy:2-alpine
COPY --from=frontend /app/public /var/www/html/public
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile

# Uploads use the "public" disk and are served at /storage/*. Recreate the
# storage symlink (the copied one points at a dev-machine path) so Caddy can
# resolve public/storage -> the shared storage volume mounted at runtime.
RUN ln -sf /var/www/html/storage/app/public /var/www/html/public/storage
