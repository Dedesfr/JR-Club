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
| **Frontend** | React + TypeScript + Tailwind CSS (via Inertia.js) |
| **Backend** | Laravel 12 |
| **Database** | PostgreSQL |
| **Real-Time** | Laravel Reverb (WebSocket) |
| **ORM** | Eloquent + Laravel migrations |
| **PWA** | Vite PWA plugin + Web Push API |
| **Containerization** | Docker + Docker Compose |

## Integrations

- Real-time (Laravel Reverb — WebSocket server for live scoring)
- Push Notifications (Web Push API + Laravel queues)

## Non-Functional Requirements

- **Users**: <1k (internal community)
- **SEO**: Not needed (internal app)
- **Security**: Standard auth (email/password via Laravel Breeze)

## Deployment

- **Host**: VPS (DigitalOcean, Hetzner, or similar)
- **Container**: Docker + Docker Compose
- **Environments**: Production only
- **Services**: PHP-FPM + nginx + PostgreSQL + Reverb

## Recommended Next Steps

1. `composer create-project laravel/laravel:^12.0 jrclub` — Scaffold Laravel project
2. Install Inertia.js + React + TypeScript + Tailwind CSS
3. Install Laravel Breeze (Inertia/React stack) for auth scaffolding
4. Install Laravel Reverb for WebSocket support
5. Configure Vite PWA plugin
6. Set up Docker Compose (PHP-FPM, nginx, PostgreSQL, Reverb)
7. Define PostgreSQL migrations and Eloquent models
8. Implement auth and user profiles
9. Build activity CRUD and joining flow
10. Add team management
11. Build league/competition system
12. Implement live scoring with Reverb broadcasts
13. Build leaderboard system
14. Add push notifications via queue jobs
