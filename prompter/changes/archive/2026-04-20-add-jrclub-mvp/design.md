## Context

JR Club is a greenfield PWA for Jasa Raharja's internal sports community (<1k users). The app must support real-time live scoring, team management, and league competitions. Dockerized on a VPS (single production environment).

### UI Templates

Approved HTML/Tailwind templates are provided in `template/`. Every page implementation MUST match its corresponding template. Do not invent layouts or components — translate the template to React/Inertia.

| Template | Path | Inertia Page |
|----------|------|--------------|
| Login | `template/authentication_login/code.html` | `Pages/Auth/Login.tsx` |
| Activity Feed | `template/sport_activities_feed/code.html` | `Pages/Activities/Index.tsx` |
| Leagues & Competitions | `template/leagues_competitions/code.html` | `Pages/Leagues/Index.tsx` |
| Live Match Detail | `template/live_match_detail/code.html` | `Pages/Matches/Show.tsx` |
| Team Management | `template/team_management/code.html` | `Pages/Teams/Index.tsx` |
| Leaderboards | `template/leaderboards/code.html` | `Pages/Leaderboards/Index.tsx` |
| User Profile | `template/user_profile/code.html` | `Pages/Profile/Show.tsx` |

Design system specification: `template/rahardja_kinetic/DESIGN.md`
Extracted Tailwind tokens: `prompter/design-system.md`

## Goals / Non-Goals

- Goals:
  - Deliver a mobile-first PWA with offline-capable shell
  - Real-time live scoring using Laravel Reverb (WebSocket)
  - Simple role-based access (Member / Admin) via Laravel Gates
  - Full-stack Inertia.js — no separate REST/GraphQL API
  - Push notifications via Web Push API + Laravel queues
  - Dockerized deployment on VPS (PHP-FPM + nginx + PostgreSQL + Reverb)

- Non-Goals:
  - SEO optimization (internal app)
  - Payment processing (v2)
  - Chat/messaging (v2)
  - File uploads / media storage (v2)
  - Multi-tenant architecture
  - Separate mobile app (React Native, etc.)

## Decisions

- **Backend: Laravel 12**
  - Why: Mature full-stack framework, excellent Inertia integration, built-in auth (Breeze), Eloquent ORM, Reverb for WebSockets, queues for notifications
  - Alternatives: Node/Express (less batteries-included), Convex (OSS self-hosting less mature)

- **Frontend: React + TypeScript + Inertia.js**
  - Why: Inertia eliminates the need for a separate API layer — Laravel controllers return Inertia::render() directly. React for reactive UI, TypeScript for type safety.
  - Alternatives: Vue (less TypeScript adoption in team), Next.js (overkill without SEO needs)

- **Database: PostgreSQL**
  - Why: Richer feature set than MySQL, JSON support, better for complex standings queries
  - Alternatives: MySQL (fine but less capable for complex aggregates)

- **Real-Time: Laravel Reverb**
  - Why: First-party Laravel WebSocket server, uses the same Broadcasting API as Pusher. Zero external service dependency, self-hosted in Docker.
  - Alternatives: Pusher (external service + cost), Soketi (third-party OSS), Socket.io (not Laravel-native)

- **Auth: Laravel Breeze (Inertia/React stack)**
  - Why: Official Laravel starter kit with Inertia + React scaffolding, email/password out of the box
  - Alternatives: Jetstream (heavier), Sanctum SPA (requires separate API setup)

- **PWA: Vite PWA Plugin (vite-plugin-pwa)**
  - Why: Works seamlessly with Laravel's Vite integration, handles Workbox service worker generation and web manifest

## Data Model

```sql
users
  id, name, email, password, role (member|admin), email_verified_at, push_subscription (json), timestamps

sports
  id, name, icon, max_players_per_team, description, timestamps

activities
  id, sport_id, created_by, title, description, location, scheduled_at, max_participants, status (open|full|completed|cancelled), timestamps

activity_participants
  id, activity_id, user_id, joined_at

teams
  id, name, sport_id, created_by, timestamps

team_members
  id, team_id, user_id, role (member|captain), joined_at

leagues
  id, name, sport_id, description, start_date, end_date, status (upcoming|active|completed), created_by, timestamps

league_teams
  id, league_id, team_id, registered_at

matches
  id, league_id, home_team_id, away_team_id, scheduled_at, status (scheduled|live|completed), home_score (default 0), away_score (default 0), timestamps

league_standings (computed view or cached table)
  league_id, team_id, played, won, drawn, lost, goals_for, goals_against, points
```

## Risks / Trade-offs

- **Inertia full-page reloads on navigation** — Inertia handles this via XHR, so navigation is SPA-like. Not a real risk.
- **Reverb scaling** — single-server Reverb is sufficient for <1k users. Scale to Pusher-compatible service if needed later.
- **PWA on iOS** — Web Push API requires iOS 16.4+ Safari. Mitigation: document minimum requirements, graceful degradation for older iOS.
- **Standing computation** — Computed on the fly via Eloquent aggregation queries. Cache with Laravel Cache if queries become slow (unlikely at <1k scale).

## Open Questions

- Does Jasa Raharja have specific security/compliance requirements for data hosting?
- Should the app support Bahasa Indonesia (localization)?
- Are there existing employee directories (LDAP/AD) for user provisioning?
