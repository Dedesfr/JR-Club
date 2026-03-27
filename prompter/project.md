# Project Context

## Purpose

JR Club is a PWA mobile app for PT Jasa Raharja's internal sports community. It enables employees to create and join sport activities (Padel, Basketball, Futsal, etc.), compete in leagues with live scoring, and track rankings through leaderboards.

**Client**: PT Jasa Raharja — https://jasaraharja.co.id/id
**App type**: Progressive Web App (PWA), mobile-first
**Target users**: Jasa Raharja employees (<1k users, internal)

## Tech Stack

- **Frontend**: React (Vite) + TypeScript + Tailwind CSS
- **Backend**: Convex (self-hosted, open-source)
- **Database**: Convex built-in document DB with real-time subscriptions
- **PWA**: Vite PWA plugin + Workbox + Web Push API
- **Containerization**: Docker + Docker Compose
- **Deployment**: VPS (single production environment)

## Project Conventions

### Code Style
- TypeScript strict mode
- Tailwind CSS for styling — no CSS modules or styled-components
- File naming: kebab-case for files, PascalCase for components
- Component files co-located with their feature (not a shared `components/` dump)

### Architecture Patterns
- Feature-based folder structure (e.g., `src/features/activities/`, `src/features/leagues/`)
- Convex functions in `convex/` directory (queries, mutations, actions)
- React components consume Convex hooks directly (`useQuery`, `useMutation`)
- Role-based access enforced on Convex mutations (server-side), not just UI

### Testing Strategy
- No testing framework mandated for MVP — validate via Convex validation and TypeScript types
- Manual testing on iOS Safari (16.4+) and Android Chrome for PWA features

### Git Workflow
- Single `main` branch for production
- Feature branches: `feature/<description>`
- Commit convention: `feat:`, `fix:`, `chore:`, `refactor:` prefixes

## Domain Context

- **Sports supported**: Padel, Basketball, Futsal (extensible via Sports table)
- **Activity**: A scheduled sport session — has location, date/time, max participants, status
- **League**: A competition with multiple registered teams, a schedule of matches, and standings
- **Match**: A game between two teams within a league, supports live scoring via Convex subscriptions
- **Leaderboard**: Derived from match results — points (3W/1D/0L), GD, GF as tiebreakers
- **Roles**: `member` (participate) and `admin` (manage everything). No organizer/captain in MVP.

## Important Constraints

- Self-hosted Convex — do not use Convex Cloud; all backend runs in Docker on VPS
- No external auth providers (no Clerk, no Auth0) — use Convex Auth with email/password
- No file uploads in MVP — profile photos and logos are deferred to v2
- No payments in MVP
- App is internal — no SEO requirements, no public-facing pages
- iOS 16.4+ required for push notifications on iPhone (Web Push API)

## External Dependencies

- **Convex OSS** — self-hosted backend (https://github.com/get-convex/convex-backend)
- **Vite PWA Plugin** — service worker and PWA manifest generation
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
