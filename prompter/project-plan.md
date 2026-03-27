# JR Club — Project Plan

**Project**: JR Club — PWA Mobile App for Sports Activity Management
**Client**: PT Jasa Raharja (https://jasaraharja.co.id/id)
**Type**: Progressive Web App (PWA)
**Date**: 2026-03-28

## Problem Statement

Jasa Raharja's sports community needs a centralized platform to organize, discover, and participate in sports activities (Padel, Basketball, Futsal, etc.), run competitive leagues, and track performance through leaderboards.

## MVP Features

1. **User Authentication** — Register/login for members and admins
2. **Sport Activities** — Create, browse, and join sport sessions
3. **Team Management** — Create teams, manage rosters
4. **Leagues & Competitions** — Organize tournaments with schedules and standings
5. **Live Scoring** — Real-time score updates during matches
6. **Leaderboards** — Rankings from match/league results
7. **Push Notifications** — Activity reminders, score updates, league announcements
8. **User Profiles** — Member profiles with activity history and stats

## Deferred (v2+)

- Payment/membership fees
- Chat/messaging
- Social login
- File storage (photos, logos)
- Admin analytics dashboard

## User Roles

| Role | Permissions |
|------|-------------|
| **Member** | Join activities, view leagues, see leaderboards, manage own profile |
| **Admin** | All member permissions + create activities, manage leagues, manage users, live scoring |

## Data Model

- **Users** — Profiles, auth, roles
- **Sports** — Sport types (Padel, Futsal, Basketball, etc.)
- **Activities** — Scheduled sessions with sport type, location, time, participants
- **Teams** — Groups of members with rosters
- **Leagues** — Competitions with rules, schedules, standings
- **Matches** — Games within leagues with live scores
- **Leaderboard** — Rankings derived from results

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite) + TypeScript + Tailwind CSS |
| **Backend** | Convex (self-hosted, open-source) |
| **Database** | Convex built-in (document DB with real-time sync) |
| **Real-Time** | Convex subscriptions (built-in) |
| **PWA** | Vite PWA plugin + Web Push API |
| **Containerization** | Docker + Docker Compose |

## Integrations

- Real-time (Convex built-in subscriptions)
- Push Notifications (Web Push API)

## Non-Functional Requirements

- **Users**: <1k (internal community)
- **SEO**: Not needed (internal app)
- **Security**: Standard auth (email/password)

## Deployment

- **Host**: VPS (DigitalOcean, Hetzner, or similar)
- **Container**: Docker + Docker Compose
- **Environments**: Production only
- **Convex**: Self-hosted via Docker

## Recommended Next Steps

1. `npm create convex@latest` — Scaffold React + Convex project
2. Configure Vite PWA plugin
3. Set up Docker Compose for self-hosted Convex
4. Implement auth and user profiles
5. Build activity CRUD and joining flow
6. Add team management
7. Build league/competition system
8. Implement live scoring with Convex subscriptions
9. Build leaderboard system
10. Add push notifications
