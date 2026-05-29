# JR Club — VPS Deployment Guide

This doc is for an AI agent deploying this Laravel + Inertia + Reverb app on a VPS
that already runs another Laravel project via Docker.

---

## Preconditions

Verify each before starting. Abort and report if any fails.

- Docker and Docker Compose v2 installed → `docker compose version` prints a v2.x version
- The repo is cloned on the VPS (these steps assume `/srv/jrclub`)
- Caddy is installed on the host and running → `systemctl is-active caddy` prints `active`
- Host ports `8080` and `8082` are free → `ss -ltn | grep -E ':8080|:8082'` prints nothing
- DNS: `jrclub.dedesfr.my.id` resolves to this VPS's public IP → `dig +short jrclub.dedesfr.my.id` matches `curl -s ifconfig.me`
  (TLS issuance in the final step will fail otherwise.)

> Note on ports: this stack already assumes the *other* project on this VPS holds
> `8081`. If `8080`/`8082` are taken, pick free host ports and update them in
> `docker-compose.yml` (left side of `ports:`) and the host Caddyfile to match.

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
APP_KEY=                                # generate in step 4
APP_URL=https://jrclub.dedesfr.my.id

DB_PASSWORD=<strong-password>           # change from "secret"

SESSION_SECURE_COOKIE=true              # cookies only sent over HTTPS

# --- Reverb: SERVER-SIDE publishing (app/queue -> Reverb) ---
# These must point at the Reverb container over the internal Docker network,
# NOT the public domain. The app POSTs events to {scheme}://{host}:{port}/apps/...
# and the host Caddy only routes the public /app/* (websockets) to Reverb,
# so publishing via the domain would 404. Keep these internal:
REVERB_HOST=reverb                      # the docker-compose service name
REVERB_PORT=8080
REVERB_SCHEME=http

# --- Reverb: BROWSER client (baked into JS at BUILD time) ---
# .env is excluded from the image, so these are passed as docker-compose build
# args. They describe how the browser reaches Reverb through the host Caddy.
# IMPORTANT: set VITE_REVERB_APP_KEY to a literal value — do NOT leave it as
# "${REVERB_APP_KEY}", compose does not reliably expand nested .env refs.
VITE_REVERB_APP_KEY=jrclub-key          # must match REVERB_APP_KEY
VITE_REVERB_HOST=jrclub.dedesfr.my.id
VITE_REVERB_SCHEME=https
VITE_REVERB_PORT=443
```

> Why two different hosts? The **server** publishes events to Reverb privately
> inside Docker (`reverb:8080`), while the **browser** subscribes over the public
> domain (`wss://jrclub.dedesfr.my.id/app/...`). These are separate paths and
> must not be conflated.

### 4. Generate app key

```bash
docker compose run --rm app php artisan key:generate --show
```
Copy the printed `base64:...` value into `APP_KEY=` in `.env`.
**Verify:** `grep '^APP_KEY=base64:' .env` prints a non-empty line.

### 5. Build and start

```bash
docker compose build --no-cache
docker compose up -d
```
**Verify:** `docker compose ps` shows `app, web, postgres, reverb, queue` all
`Up` (postgres `healthy`). If any is `Restarting`/`Exited`, inspect its logs
(`docker compose logs <name> --tail=50`) before continuing.

### 6. Check logs for errors

```bash
docker compose logs app --tail=50
docker compose logs web --tail=20
```
**Verify:** no fatal errors. The `app` log should show migrations ran. A
common failure here is a missing `APP_KEY` or DB not ready — fix `.env` and
`docker compose up -d` again.

### 7. Smoke test the container directly (before TLS)

```bash
curl -I http://127.0.0.1:8080
```
**Verify:** `HTTP/1.1 200 OK`. This proves the web→app→DB path works locally,
independent of the host Caddy.

### 8. Wire up the host Caddy (TLS + public routing)

Append the block below to the host Caddy config (`/etc/caddy/Caddyfile`, or an
imported site file). It is also saved at `docker/caddy/host-Caddyfile.example`.

```caddy
jrclub.dedesfr.my.id {
    # Reverb websocket (Pusher protocol endpoint is /app/<key>).
    handle /app/* {
        reverse_proxy 127.0.0.1:8082
    }

    # Everything else -> the app's web (Caddy) container.
    handle {
        reverse_proxy 127.0.0.1:8080
    }
}
```

Validate, then reload (validate first so a typo can't take Caddy down):

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```
**Verify:** both commands exit 0. Caddy fetches the Let's Encrypt cert
automatically (watch with `sudo journalctl -u caddy -f` — look for
`certificate obtained successfully`).

### 9. End-to-end verification (definition of done)

```bash
curl -I https://jrclub.dedesfr.my.id
```
**Done when all hold:**
- The command returns `HTTP/2 200` with a valid (non-self-signed) certificate.
- The login page loads in a browser with the padlock and **no mixed-content
  warnings** in the console.
- After logging in, a live-updating view (e.g. a match score) updates without
  a refresh — confirms Reverb websockets work end-to-end. Cross-check with
  `docker compose logs reverb --tail=20` (connection entries, no errors).

---

## Updates / Redeployment

```bash
cd /srv/jrclub
git pull
docker compose build --no-cache
docker compose up -d
```

Migrations run automatically on container start via `docker/entrypoint.sh`.
The host Caddy config only needs changing if the domain or ports change.

---

## Troubleshooting

| Symptom | Command | Likely cause |
|---|---|---|
| Blank page / 500 | `docker compose logs app` | Missing APP_KEY or DB not ready |
| Assets 404 | `docker compose exec web ls public/build` | Frontend build failed |
| Browser can't open websocket | `docker compose logs reverb` | `VITE_REVERB_*` wrong/not baked — rebuild `--no-cache` after fixing `.env` |
| Live updates never arrive (WS connects) | `docker compose logs reverb` | `REVERB_HOST` not set to `reverb` (server publishing to the public domain, which 404s) |
| Mixed-content / insecure warnings | browser console | `VITE_REVERB_SCHEME`/`APP_URL` not `https`, or rebuild needed |
| DB connection refused | `docker compose logs postgres` | Postgres not healthy yet |
| Migrations failed | `docker compose exec app php artisan migrate --force` | Run manually |
| Storage files missing | `docker compose exec app php artisan storage:link` | Re-link storage |

---

## Ports Summary

| Service | Container port | Host port (default) |
|---|---|---|
| web / Caddy (HTTP) | 80 | 8080 |
| Reverb (WS) | 8080 | 8082 |
| Postgres | 5432 | not exposed |
