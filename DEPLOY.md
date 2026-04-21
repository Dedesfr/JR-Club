# JR Club — VPS Deployment Guide

This doc is for an AI agent deploying this Laravel + Inertia + Reverb app on a VPS
that already runs another Laravel project via Docker.

---

## Preconditions

- Docker and Docker Compose v2 are installed (`docker compose version`)
- The repo is cloned on the VPS
- Port `8080` (nginx) and `8081` (Reverb websocket) are available — or you have a reverse proxy (Traefik/nginx) in front

---

## First Deploy

### 1. Clone & enter the repo

```bash
git clone <repo-url> /srv/jrclub
cd /srv/jrclub
```

### 2. Create `.env` from the example

```bash
cp .env.example .env
```

### 3. Edit `.env` — required changes for production

```bash
# Minimum required values to change:
APP_ENV=production
APP_DEBUG=false
APP_KEY=                        # generate below
APP_URL=https://<your-domain>   # e.g. https://jrclub.example.com

DB_PASSWORD=<strong-password>   # change from "secret"

REVERB_HOST=<your-domain>       # public hostname, not 0.0.0.0
VITE_REVERB_HOST=<your-domain>
REVERB_SCHEME=https             # if behind TLS termination proxy
VITE_REVERB_SCHEME=https
REVERB_PORT=443                 # or 8081 if no proxy
VITE_REVERB_PORT=443
```

### 4. Generate app key

```bash
docker compose run --rm app php artisan key:generate --show
# Copy the output and set it as APP_KEY in .env
```

### 5. Build and start

```bash
docker compose build --no-cache
docker compose up -d
```

### 6. Verify all containers are running

```bash
docker compose ps
# Expected: app, nginx, postgres, reverb, queue — all Up
```

### 7. Check app logs for errors

```bash
docker compose logs app --tail=50
docker compose logs nginx --tail=20
```

### 8. Smoke test

```bash
curl -I http://localhost:8080
# Expected: HTTP/1.1 200 OK
```

---

## Updates / Redeployment

```bash
cd /srv/jrclub
git pull
docker compose build --no-cache
docker compose up -d
```

Migrations run automatically on container start via `docker/entrypoint.sh`.

---

## Reverse Proxy (answer one of the following for the AI agent)

### Option A: If using Traefik
Add these labels to the `nginx` service in `docker-compose.yml`:

```yaml
nginx:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.jrclub.rule=Host(`jrclub.example.com`)"
    - "traefik.http.routers.jrclub.entrypoints=websecure"
    - "traefik.http.routers.jrclub.tls=true"
    - "traefik.http.services.jrclub.loadbalancer.server.port=80"
  networks:
    - traefik_network   # must match the external Traefik network name
```

And for Reverb:
```yaml
reverb:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.jrclub-reverb.rule=Host(`jrclub.example.com`) && PathPrefix(`/app`)"
    - "traefik.http.routers.jrclub-reverb.entrypoints=websecure"
    - "traefik.http.services.jrclub-reverb.loadbalancer.server.port=8080"
```

Remove the `ports:` entries from nginx/reverb services when using Traefik.

### Option B: If using host nginx as a proxy
Create a vhost in `/etc/nginx/sites-available/jrclub`:

```nginx
server {
    listen 80;
    server_name jrclub.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name jrclub.example.com;

    ssl_certificate     /etc/letsencrypt/live/jrclub.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jrclub.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /app/ {
        proxy_pass http://127.0.0.1:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

---

## Troubleshooting

| Symptom | Command | Likely cause |
|---|---|---|
| Blank page / 500 | `docker compose logs app` | Missing APP_KEY or DB not ready |
| Assets 404 | `docker compose exec app ls public/build` | Frontend build failed |
| WebSocket not connecting | `docker compose logs reverb` | Wrong REVERB_HOST in .env |
| DB connection refused | `docker compose logs postgres` | Postgres not healthy yet |
| Migrations failed | `docker compose exec app php artisan migrate --force` | Run manually |
| Storage files missing | `docker compose exec app php artisan storage:link` | Re-link storage |

---

## Ports Summary

| Service | Container port | Host port (default) |
|---|---|---|
| nginx (HTTP) | 80 | 8080 |
| Reverb (WS) | 8080 | 8081 |
| Postgres | 5432 | not exposed |
