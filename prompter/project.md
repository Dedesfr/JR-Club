# Project Context

## Purpose

JR Club is a PWA mobile app for PT Jasa Raharja's internal sports community. It enables employees to create and join sport activities (Padel, Basketball, Futsal, etc.), compete in leagues with live scoring, and track rankings through leaderboards.

**Client**: PT Jasa Raharja — https://jasaraharja.co.id/id
**App type**: Progressive Web App (PWA), mobile-first
**Target users**: Jasa Raharja employees (<1k users, internal)

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS via Inertia.js
- **Backend**: Laravel 12
- **Database**: PostgreSQL
- **Real-Time**: Laravel Reverb (WebSocket server for live scoring)
- **ORM**: Eloquent + Laravel migrations
- **PWA**: Vite PWA plugin + Workbox + Web Push API
- **Queue**: Laravel queue (database driver) for push notification jobs
- **Containerization**: Docker + Docker Compose
- **Deployment**: VPS (single production environment)

## Project Conventions

### Code Style
- PHP 8.3+, Laravel conventions (PSR-12)
- TypeScript strict mode on the React/Inertia side
- Tailwind CSS for all styling — no CSS modules or styled-components
- React component files: PascalCase (`ActivityCard.tsx`), co-located with their Inertia page
- Laravel: feature-based service classes, no fat controllers

### Architecture Patterns
- Inertia.js as the glue: Laravel controllers return `Inertia::render()`, React pages in `resources/js/Pages/`
- Feature-based frontend structure: `resources/js/Pages/Activities/`, `Pages/Leagues/`, etc.
- Shared components in `resources/js/Components/`
- Role-based access via Laravel Gates/Policies — enforced server-side, not just in UI
- Laravel Reverb for WebSocket broadcasts (live scoring events)
- Laravel Form Requests for all input validation

### Testing Strategy
- Feature tests with PHPUnit for critical server-side logic (auth, scoring, standings)
- Manual testing on iOS Safari (16.4+) and Android Chrome for PWA and push notifications

### Git Workflow
- Single `main` branch for production
- Feature branches: `feature/<description>`
- Commit convention: `feat:`, `fix:`, `chore:`, `refactor:` prefixes

## Domain Context

- **Sports supported**: Padel, Basketball, Futsal (extensible via `sports` table)
- **Activity**: A scheduled sport session — has sport type, location, date/time, max participants, status
- **League**: A competition with registered teams, a match schedule, and standings
- **Match**: A game between two teams within a league; live scoring broadcast via Reverb
- **Leaderboard**: Derived from match results — points (3W/1D/0L), GD, GF as tiebreakers
- **Roles**: `member` (participate) and `admin` (manage everything). No organizer/captain in MVP.

## Important Constraints

- No external auth services — use Laravel Breeze with email/password
- No file uploads in MVP — profile photos and logos deferred to v2
- No payments in MVP
- App is internal — no SEO requirements, no public-facing pages
- iOS 16.4+ required for push notifications on iPhone (Web Push API)
- Inertia.js only — no separate API; all data flows through Inertia props and form submissions

## External Dependencies

- **Laravel Reverb** — first-party Laravel WebSocket server
- **Inertia.js** — React/Laravel bridge (no separate API layer)
- **Vite PWA Plugin** — service worker and manifest generation
- **Web Push API** — browser-native push notifications (no third-party push service)

## Brand Reference

| Element | Value |
|---------|-------|
| Primary Blue | `#006ECF` |
| Primary Dark | `#003869` |
| Brand Gradient | `linear-gradient(180deg, #006ECF, #003869)` |
| Background | `#FFFFFF` |
| Border radius | `1rem` (rounded cards, flat design) |
| Font | Inter or Plus Jakarta Sans |
| PWA theme-color | `#006ECF` |
