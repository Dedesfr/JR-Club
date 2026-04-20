# JR CLUB
## Executive Summary

**The private sports club experience — built for every PT Jasa Raharja employee.**

---

## At a Glance

|                   |                                                                  |
| ----------------- | ---------------------------------------------------------------- |
| **Product Type**  | Internal Sports Community Platform                               |
| **Target Market** | PT Jasa Raharja employees (internal, <1,000 users)               |
| **Platform**      | Progressive Web App (PWA) — mobile-first, installable            |
| **Technology**    | Laravel 12 · React · Inertia.js · PostgreSQL · Laravel Reverb   |
| **Status**        | MVP in development — proposal approved, implementation pending   |

---

## Product Overview

### What is JR Club?

JR Club is a mobile-first Progressive Web App that gives PT Jasa Raharja's employee sports community a premium, centralized platform. Members can discover and join sport sessions, form competitive teams, participate in leagues with live match scoring, and track their rankings on leaderboards — all from a single, installable app.

The platform is designed exclusively for internal use: no public access, no external logins, no fees. It is deployed on company-controlled infrastructure, keeping employee data within PT Jasa Raharja's own environment.

### The Problem We Solve

| Challenge | Impact |
| --------- | ------ |
| No centralized place to organize sport sessions | Activities are coordinated ad-hoc via chat groups, leading to low participation and scheduling conflicts |
| No structured competition format | Employees have no way to run leagues or track standings, reducing engagement |
| No real-time match experience | Match results are shared manually after the fact, missing the excitement of live play |
| No performance visibility | Members have no record of their participation history or competitive performance |

### Our Solution

```
Employee opens JR Club
        │
        ▼
┌──────────────────┐     ┌────────────────────┐     ┌─────────────────────┐
│  Browse & Join   │ ──▶ │  Compete in League │ ──▶ │  Track Rankings on  │
│  Sport Sessions  │     │  with Live Scoring  │     │  Leaderboard        │
└──────────────────┘     └────────────────────┘     └─────────────────────┘
        │                         │                           │
   Push notification          Real-time WebSocket        Stats on
   on new activity             score updates             profile page
```

---

## Core Capabilities

### 1️⃣ Sport Activity Management
- Create sessions for Padel, Basketball, Futsal, and more
- Browse activities filtered by sport type
- Join or leave sessions with real-time spot tracking
- Auto-close when maximum participants is reached
- Admin controls: complete or cancel any activity

### 2️⃣ Team Management
- Admins create teams tied to a specific sport
- Manage rosters: add or remove members
- Members view their own teams from a "My Teams" page
- Teams serve as the competitive unit in leagues

### 3️⃣ Leagues & Competitions
- Admins create leagues with start/end dates and sport type
- Register teams to leagues (sport-type validated)
- Schedule matches between registered teams
- Automatic standings computed: W/D/L, points (3-1-0), goal difference, goals for
- League lifecycle: upcoming → active → completed

### 4️⃣ Live Scoring
- Admins start a match and update scores in real-time
- All connected viewers see score updates instantly via WebSocket (Laravel Reverb)
- End match finalizes the score and triggers automatic standings recalculation
- No manual data entry lag — the scoreboard is always current

### 5️⃣ Leaderboards & Rankings
- Per-league standings with full stats (P, W, D, L, GF, GA, GD, Pts)
- Overall leaderboard aggregated by sport type across all leagues
- Individual player stats: activities joined, matches played, win rate

### 6️⃣ Push Notifications & Engagement
- Web Push API (no third-party service) — native browser push
- Notifications for: new activity created, activity reminder, activity cancelled
- Match alerts: starting soon, score updates, final result
- Users opt in or out at any time

---

## Key Benefits

| Benefit | Description |
| ------- | ----------- |
| ⚡ **Real-Time Experience** | Live match scores update instantly for all viewers — no refresh needed |
| 📱 **Installable PWA** | Works like a native app on Android and iOS — no app store required |
| 🔔 **Push Notifications** | Keep employees engaged with timely activity and match alerts |
| 🔐 **Data Sovereignty** | Self-hosted on PT Jasa Raharja's own VPS — no data leaves company infrastructure |
| 🏆 **Structured Competition** | Full league system with standings, match history, and player stats |
| 🚀 **Zero Friction Access** | Email/password login — no external accounts, no app store downloads |

---

## User Roles Supported

| Role | Primary Functions |
| ---- | ---------------- |
| **Member** | Browse and join activities · View leagues and standings · See leaderboards · Manage own profile |
| **Admin** | All member functions · Create activities and leagues · Manage teams and rosters · Schedule matches · Update live scores · Manage users |

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    VPS (Docker)                      │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌─────────────────┐ │
│  │  nginx   │   │ PHP-FPM  │   │  Laravel Reverb │ │
│  │ (reverse │──▶│ Laravel  │──▶│  (WebSocket)    │ │
│  │  proxy)  │   │    12    │   └─────────────────┘ │
│  └──────────┘   └────┬─────┘                       │
│                      │                             │
│               ┌──────▼──────┐   ┌───────────────┐ │
│               │ PostgreSQL  │   │ Queue Worker  │ │
│               │     DB      │   │ (Push Notif.) │ │
│               └─────────────┘   └───────────────┘ │
└─────────────────────────────────────────────────────┘
         ▲
         │ Inertia.js (SPA-like, no separate API)
         ▼
┌──────────────────────┐
│  React + TypeScript  │
│  (PWA — Installable) │
└──────────────────────┘
```

**8 core modules:** Authentication · User Profiles · Sport Activities · Team Management · Leagues · Matches/Live Scoring · Leaderboards · Push Notifications

---

## Infrastructure Highlights

- **Self-hosted Convex replacement**: Laravel Reverb provides first-party WebSocket support — no external service dependency
- **Single deployment target**: One VPS running Docker Compose with 4 services (nginx, PHP-FPM, PostgreSQL, Reverb)
- **No third-party auth**: Laravel Breeze with email/password — employee credentials stay on-premise
- **PWA install**: Vite PWA plugin + Workbox generates service worker and web manifest automatically
- **Queue-based notifications**: Laravel queue (database driver) handles push notification dispatch asynchronously

---

## Sports Activity Workflow

```
Admin creates activity
        │
        ▼
Activity published (status: open)
        │
        ├──▶ Members browse and join
        │           │
        │           ▼
        │    Spots fill up → status: full
        │
        ├──▶ Push notification sent to community
        │
        └──▶ Admin marks complete → status: completed
```

## League Competition Workflow

```
Admin creates league
        │
        ▼
Teams registered → Matches scheduled
        │
        ▼
Match day: Admin starts match (status: live)
        │
        ├──▶ Admin updates score → WebSocket broadcast → All viewers update instantly
        │
        └──▶ Admin ends match → Final score recorded → Standings recalculated
```

---

## Competitive Advantages

| Feature | JR Club | Generic Chat Groups | Off-the-shelf Sports Apps |
| ------- | ------- | ------------------- | ------------------------- |
| Centralized activity discovery | ✅ | ❌ | ✅ |
| Live match scoring | ✅ | ❌ | ✅ |
| Internal/private community | ✅ | ✅ | ❌ |
| Data stays on-premise | ✅ | ❌ | ❌ |
| No app store required | ✅ | ❌ | ❌ |
| Custom to PT Jasa Raharja brand | ✅ | ❌ | ❌ |
| Structured league management | ✅ | ❌ | ⚠️ varies |
| Push notifications | ✅ | ✅ | ✅ |
| Zero external subscription cost | ✅ | ✅ | ❌ |

---

## Roadmap Considerations

### Current State (MVP)
- Email/password authentication with member and admin roles
- Sport activity creation, discovery, and joining
- Team management and rosters
- League and competition management with standings
- Real-time live scoring (WebSocket)
- Leaderboards (per-league and overall)
- Push notifications (Web Push API)
- User profiles with activity history and stats

### Potential Enhancements

| Priority | Enhancement |
| -------- | ----------- |
| High | Profile photos and team logos (file upload, v2) |
| High | Bahasa Indonesia localization |
| Medium | Admin analytics dashboard (participation trends, popular sports) |
| Medium | Social login (Google SSO with corporate email) |
| Medium | Activity fee collection / membership payments |
| Low | In-app messaging and team chat |
| Low | Sport bracket/knockout tournament format |
| Low | Integration with Jasa Raharja employee directory (LDAP/AD) |

---

## Technical Foundation

| Component | Choice | Why |
| --------- | ------ | --- |
| **Backend** | Laravel 12 | Mature PHP framework with built-in auth, queues, WebSockets, and Inertia support |
| **Frontend** | React + TypeScript + Inertia.js | SPA-like experience without a separate API; type-safe UI layer |
| **Database** | PostgreSQL | Rich aggregation for standings queries; JSON support for push subscriptions |
| **Real-Time** | Laravel Reverb | First-party Laravel WebSocket server; Pusher-protocol compatible; self-hosted |
| **PWA** | Vite PWA Plugin | Seamless integration with Laravel Vite; Workbox service worker generation |
| **Notifications** | Web Push API | Native browser push — no third-party service (Pusher, Firebase, etc.) |
| **Containerization** | Docker + Compose | Reproducible environments; single-command deployment |
| **Styling** | Tailwind CSS | Utility-first; aligns with "Rahardja Kinetic" design system tokens |
| **Design System** | Rahardja Kinetic | Custom editorial system built on BUMN Blue palette; approved UI templates per screen |

---

## Getting Started

### For New Implementation
1. `composer create-project laravel/laravel:^12.0 jrclub` — scaffold Laravel project
2. Install Inertia.js, Laravel Breeze (React/TypeScript stack), and Laravel Reverb
3. Configure Tailwind CSS with Rahardja Kinetic design tokens (`prompter/design-system.md`)
4. Set up Docker Compose: PHP-FPM · nginx · PostgreSQL · Reverb · queue worker
5. Run database migrations and seed sport data
6. Implement features following `prompter/changes/add-jrclub-mvp/tasks.md` in order
7. Reference UI templates in `template/<screen>/code.html` for each page implementation

### For Stakeholder Review
- Full project plan: `prompter/project-plan.md`
- Technical architecture: `prompter/changes/add-jrclub-mvp/design.md`
- Feature specifications: `prompter/changes/add-jrclub-mvp/specs/`
- UI templates: `template/*/screen.png`
- Design system: `prompter/design-system.md`

---

## Summary

JR Club transforms PT Jasa Raharja's sports community by:

1. **Centralizing** activity discovery and sign-up — replacing fragmented chat coordination
2. **Elevating** competition with structured leagues, standings, and live scoring
3. **Engaging** employees with real-time notifications and performance tracking
4. **Protecting** company data with fully self-hosted, on-premise infrastructure
5. **Delivering** a premium mobile experience through an installable PWA — no app store needed

---

## Document Information

| | |
| - | - |
| **Version** | 1.0 |
| **Date** | 2026-04-20 |
| **Classification** | Internal — PT Jasa Raharja |
| **Project Plan** | `prompter/project-plan.md` |
| **Technical Design** | `prompter/changes/add-jrclub-mvp/design.md` |
| **Specifications** | `prompter/changes/add-jrclub-mvp/specs/` |
| **UI Templates** | `template/*/code.html` |
| **Design System** | `prompter/design-system.md` |
