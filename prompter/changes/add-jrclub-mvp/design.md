## Context

JR Club is a greenfield PWA for Jasa Raharja's internal sports community (<1k users). The app must support real-time live scoring, team management, and league competitions. Self-hosted Convex on a VPS with Docker is the deployment target.

## Goals / Non-Goals

- Goals:
  - Deliver a mobile-first PWA with offline-capable shell
  - Real-time live scoring using Convex subscriptions
  - Simple role-based access (Member / Admin)
  - Dockerized self-hosted Convex backend on VPS
  - Push notifications via Web Push API

- Non-Goals:
  - SEO optimization (internal app)
  - Payment processing (v2)
  - Chat/messaging (v2)
  - File uploads / media storage (v2)
  - Multi-tenant architecture

## Decisions

- **Frontend: React (Vite) + TypeScript + Tailwind CSS**
  - Why: No SSR needed (internal app), Vite is fast, Tailwind accelerates mobile-first UI
  - Alternatives: Next.js (overkill without SEO needs), React Native (PWA is simpler for this scope)

- **Backend: Convex (self-hosted)**
  - Why: Built-in real-time subscriptions eliminate WebSocket boilerplate, document DB fits the data model, self-hosted keeps data on client infrastructure
  - Alternatives: Express + PostgreSQL + Socket.io (more boilerplate), Supabase (real-time less mature)

- **PWA: Vite PWA Plugin + Workbox**
  - Why: Standard approach for Vite-based PWAs, handles service worker generation and caching

- **Auth: Convex Auth**
  - Why: Integrated with Convex, supports email/password out of the box
  - Alternatives: Clerk (adds external dependency), custom JWT (unnecessary complexity)

- **Deployment: Docker Compose on VPS**
  - Why: Self-hosted Convex requires containerization, single VPS is sufficient for <1k users
  - Services: Convex backend, React frontend (nginx), reverse proxy

## Data Model Overview

```
Users
  - _id, name, email, role (member|admin), createdAt

Sports
  - _id, name, icon, maxPlayersPerTeam, description

Activities
  - _id, sportId, createdBy, title, description, location, dateTime, maxParticipants, status (open|full|completed|cancelled)

ActivityParticipants
  - _id, activityId, userId, joinedAt

Teams
  - _id, name, sportId, createdBy, createdAt

TeamMembers
  - _id, teamId, userId, role (member|captain), joinedAt

Leagues
  - _id, name, sportId, description, startDate, endDate, status (upcoming|active|completed), createdBy

LeagueTeams
  - _id, leagueId, teamId, registeredAt

Matches
  - _id, leagueId, homeTeamId, awayTeamId, scheduledAt, status (scheduled|live|completed), homeScore, awayScore

Leaderboard (derived/computed)
  - leagueId, teamId, played, won, drawn, lost, goalsFor, goalsAgainst, points
```

## Risks / Trade-offs

- **Convex self-hosting maturity** — Self-hosted Convex is newer than the cloud version. Mitigation: pin to a stable release, monitor Convex OSS releases.
- **Single VPS** — No redundancy for <1k users. Mitigation: automated backups, VPS provider snapshots. Scale to multi-node if usage grows.
- **PWA limitations** — iOS has limited push notification support. Mitigation: use Web Push API which iOS Safari now supports (iOS 16.4+).

## Open Questions

- Does Jasa Raharja have specific security/compliance requirements for data hosting?
- Should the app support multiple languages (Bahasa Indonesia + English)?
- Are there existing employee directories to integrate with for user provisioning?
