# JR Club
## Executive Summary

**A mobile-first internal sports community platform that helps PT Jasa Raharja employees organize activities, run leagues, and follow live competition in one place.**

---

## At a Glance

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Product Type**  | Internal employee engagement and sports operations platform     |
| **Target Market** | PT Jasa Raharja employees and internal program administrators   |
| **Platform**      | Progressive Web App (PWA), mobile-first web application         |
| **Technology**    | Laravel 12, Inertia React TypeScript, Tailwind CSS, PostgreSQL |
| **Status**        | MVP in active development for internal deployment               |

## Product Overview

### What is JR Club?

JR Club is a mobile-first Progressive Web App built for PT Jasa Raharja's internal sports community. It gives employees a single place to discover and join sports activities, participate in structured leagues, follow live match scoring, and monitor rankings through leaderboards.

For administrators, JR Club replaces fragmented coordination across chat, spreadsheets, and manual scheduling with a centralized operating system for sports programming. The result is faster execution, clearer participation visibility, and a more engaging employee experience.

### The Problem We Solve

| Challenge | Impact |
| --------- | ------ |
| Sports activities are often coordinated through informal channels such as chat groups and spreadsheets. | Employees miss opportunities, sign-up processes become inconsistent, and admins spend time reconciling manual updates. |
| Competitive leagues require manual schedule creation, score tracking, and standings updates. | Operations slow down, errors increase, and participant trust drops when results are delayed or unclear. |
| Employees lack a simple way to see upcoming activities, team participation, and rankings in one view. | Engagement weakens because users cannot easily discover where to join or how they are performing. |
| Live match updates are difficult to broadcast across a distributed employee base. | Spectator value drops and leagues feel less dynamic than they should. |

### Our Solution

```text
Admin creates sport activity / league
        ->
Employees discover and join
        ->
Teams and entries are organized centrally
        ->
Matches are scheduled and scored live
        ->
Leaderboards update from results
        ->
Employees stay engaged through visibility and competition
```

## Core Capabilities

### 1️⃣ Activity Management

- Create and publish scheduled sports sessions by sport, location, date, time, and capacity.
- Let employees browse available activities and join as participants.
- Track activity status and participant totals in a structured workflow.
- Support multiple sports from an extensible sports catalog.

### 2️⃣ League Operations

- Configure leagues with sport-bound categories and entry rules.
- Support both direct-entry and team-based competition structures.
- Manage league participants, advancement rules, and stage setup.
- Handle league awards and member-facing league detail views.

### 3️⃣ Live Match Scoring

- Run match scoring in real time through WebSocket-based event broadcasting.
- Support set-based scoring with configurable win conditions.
- Reflect in-progress match updates to connected users without page refreshes.
- Improve league transparency for both participants and spectators.

### 4️⃣ Leaderboards and Rankings

- Generate standings from match results using points and tie-breaker logic.
- Surface ranking visibility to members in a simple, mobile-friendly format.
- Turn league outcomes into an always-current engagement layer.

### 5️⃣ Admin Control and Governance

- Enforce role-based permissions for write actions through server-side gates.
- Centralize schedule generation, bracket shuffling, substitutions, and participant operations.
- Support import and export workflows for participant data through Excel tooling.
- Reduce operational risk by moving business rules into validated backend workflows.

### 6️⃣ Mobile-First Engagement Experience

- Deliver an installable PWA experience optimized for iOS Safari and Android Chrome.
- Use push notifications and queued jobs to keep users aware of updates.
- Provide responsive navigation patterns tailored to members and admins.
- Keep the experience accessible without requiring native app distribution.

## Key Benefits

| Benefit | Description |
| ------- | ----------- |
| ⏱️ Faster operations | Admins can manage activities, leagues, schedules, and updates in one system instead of juggling chat threads and spreadsheets. |
| ✅ Better participation control | Structured registration and role-based actions reduce ambiguity around who joined, who manages, and what happens next. |
| 📊 Real-time visibility | Live scoring and automatic leaderboards give participants immediate insight into progress and performance. |
| 🔐 Stronger governance | Server-side authorization and validated workflows protect admin-only actions and reduce process inconsistency. |
| 📁 Centralized records | Activities, teams, leagues, matches, and standings are stored in a unified operational model. |
| 🔄 Higher engagement loops | Notifications, rankings, and recurring competitions encourage repeat participation and stronger community momentum. |

## User Roles Supported

| Role | Primary Functions |
| ---- | ----------------- |
| `member` | Discover activities, join events, follow leagues, view matches, and track rankings. |
| `admin` | Create and manage sports data, activities, leagues, schedules, substitutions, scoring workflows, and participant administration. |

## System Architecture / Modules

```text
+--------------------------------------------------------------+
|                           JR Club                            |
+--------------------------------------------------------------+
| Presentation Layer                                           |
| - Inertia.js pages                                            |
| - React + TypeScript UI                                       |
| - Tailwind CSS mobile-first design                            |
+--------------------------------------------------------------+
| Application Layer                                            |
| - Authentication                                              |
| - Activity management                                         |
| - Team and participant management                             |
| - League configuration                                        |
| - Match operations and scoring                                |
| - Leaderboards and profile views                              |
+--------------------------------------------------------------+
| Real-Time and Workflow Layer                                 |
| - Laravel Reverb broadcasts                                   |
| - Queue-driven notifications                                  |
| - Form request validation                                     |
+--------------------------------------------------------------+
| Data Layer                                                    |
| - PostgreSQL                                                  |
| - Eloquent models and migrations                              |
+--------------------------------------------------------------+
| Delivery Layer                                                |
| - Vite build pipeline                                         |
| - Service worker / PWA assets                                 |
| - VPS deployment                                              |
+--------------------------------------------------------------+
```

JR Club currently centers on 5 major module groups: user access, activities, leagues and teams, live matches, and engagement surfaces such as leaderboards and notifications.

## Infrastructure Highlights

- **Modern Laravel foundation:** Built on Laravel 12 with strong conventions for routing, validation, authorization, and background processing.
- **Reactive web experience:** Uses Inertia.js to connect Laravel controllers with a React and TypeScript frontend without a separate API layer.
- **Real-time event delivery:** Laravel Reverb powers live scoring updates for ongoing matches.
- **Operational resilience:** Database-backed queues decouple push notification work from live user interactions.
- **Mobile-ready distribution:** PWA packaging enables installability and app-like behavior without app store overhead.
- **Deployment simplicity:** Docker-based local environments and VPS deployment keep infrastructure manageable for an internal MVP.

## Domain-Specific Features

### ✅ Sports Activity Workflow

- Employees can join structured activity sessions across supported sports such as Padel, Basketball, and Futsal.
- Admins can control schedule details, participation capacity, and activity states.

```text
Sport setup -> Activity creation -> Participant join flow -> Attendance-ready roster
```

### ✅ League Configuration Workflow

- Leagues support sport-bound categories and derived entry types.
- Badminton and Basketball formats can be modeled differently based on competition needs.
- Group and bracket progression rules are configurable at league level.

```text
League setup -> Category selection -> Entry definition -> Stage configuration -> Competition launch
```

### ✅ Match and Scoring Workflow

- Match records connect teams and league context.
- Set-based scoring and live broadcast events create a spectator-friendly experience.
- Standings are derived from results instead of maintained manually.

```text
Match schedule -> Live scoring -> Result finalization -> Leaderboard refresh
```

### ✅ Admin Operations Workflow

- Admin-only actions are enforced through backend gates rather than UI-only controls.
- Schedule generation, bracket management, substitutions, and participant import/export are handled centrally.

```text
Admin action -> Validation -> Persistence -> Broadcast / update surfaces
```

## Dashboard / Analytics

| Widget | Purpose |
| ------ | ------- |
| Upcoming Activities | Shows the next sessions employees can join or track. |
| Active Leagues | Highlights competitions currently running. |
| Live Matches | Surfaces in-progress games with score visibility. |
| Leaderboard Snapshot | Gives users a quick view of current rankings. |
| Participant Counts | Helps admins monitor engagement by activity or league. |
| Admin Alerts | [ASSUMPTION] Flags operational actions such as missing schedules or incomplete match results. |

## Competitive Advantages

| Feature | JR Club | Traditional Methods |
| ------- | ------- | ------------------- |
| Centralized activity and league management | ✅ | ❌ Usually split across chat, spreadsheets, and ad hoc trackers |
| Real-time match scoring visibility | ✅ | ❌ Scores often shared manually after the fact |
| Automatic leaderboard generation | ✅ | ❌ Rankings typically require manual reconciliation |
| Role-based operational control | ✅ | ❌ Informal access control creates process inconsistency |
| Mobile-first installable experience | ✅ | ❌ Tools are often desktop-biased or not optimized for repeat use |
| Internal-fit workflow design | ✅ | ❌ Generic tools rarely reflect the structure of employee sports programs |

## Roadmap Considerations

### Current State

- Mobile-first MVP tailored for PT Jasa Raharja's internal sports community.
- Core domains already modeled: sports, activities, teams, leagues, matches, and leaderboards.
- Live scoring and PWA support differentiate the experience from manual coordination.
- Current user model is intentionally simple with `member` and `admin` roles.
- Payments, public discovery, and external authentication are intentionally out of scope.

### Potential Enhancements

| Priority | Enhancement |
| -------- | ----------- |
| High | Add richer engagement analytics for participation trends, retention, and league health. |
| High | Introduce media uploads for profile photos, team logos, and event galleries. |
| Medium | Expand notification orchestration for reminders, match start alerts, and result summaries. |
| Medium | Add deeper role models such as captain, organizer, or referee if operational complexity increases. |
| Medium | Support broader sport templates and competition formats as program adoption grows. |
| Low | Explore public-facing showcase pages for internal communications [ASSUMPTION], if privacy policy permits. |

## Technical Foundation

| Component | Choice | Why |
| --------- | ------ | --- |
| Backend framework | Laravel 12 | Provides mature conventions for validation, authorization, queues, and domain modeling. |
| Frontend architecture | Inertia.js + React + TypeScript | Enables modern UX while keeping the application as one cohesive Laravel product. |
| Styling system | Tailwind CSS | Speeds consistent UI delivery in a mobile-first responsive system. |
| Database | PostgreSQL | Supports reliable relational modeling for league, match, and participant data. |
| Real-time layer | Laravel Reverb | Delivers native Laravel-aligned live scoring broadcasts. |
| Notification workflow | Database queues + Web Push API | Allows asynchronous notification delivery without third-party push infrastructure. |
| Packaging | Vite PWA plugin + Workbox | Enables installability, caching, and app-like behavior. |
| Deployment approach | Docker + VPS | Balances development consistency with straightforward internal deployment. |

## Getting Started

### For New Implementations

1. Confirm the sports program scope, administrator ownership, and employee audience.
2. Stand up the Laravel, PostgreSQL, and frontend environment using the repository setup workflow.
3. Configure authentication, roles, supported sports, and initial league or activity data.
4. Enable Reverb, queue workers, and PWA settings for live scoring and notifications.
5. Pilot with one or two sports before expanding to a broader internal rollout.

### For Existing Users

- Members can sign in, browse activities, join sessions, and monitor league progress.
- Admins can create competitions, manage schedules, and update match outcomes.
- Operations teams should monitor queues and real-time services to ensure live updates remain healthy.
- Stakeholders can use participation and leaderboard views to assess engagement momentum.

## Summary

JR Club transforms internal sports community management by:

1. Replacing fragmented coordination with one operational platform for activities, leagues, and live results.
2. Increasing employee engagement through easier discovery, stronger competition visibility, and mobile-first access.
3. Giving administrators structured controls that improve consistency, speed, and trust in sports program execution.
4. Creating a scalable digital foundation for future employee wellness and community initiatives.

## Business Model / Strategic Framing

| Item | Position |
| ---- | -------- |
| Funding model | Internal corporate product funded as an employee engagement capability [ASSUMPTION] |
| Economic value | Reduces administrative overhead while improving participation, visibility, and program quality |
| Strategic role | Supports culture, wellness, and cross-team connection inside PT Jasa Raharja |
| Success indicators | Participation rate, repeat activity join rate, league completion rate, and admin time saved [ASSUMPTION] |

## Document Information

| Item | Detail |
| ---- | ------ |
| Version | 1.0 |
| Date | 2026-05-05 |
| Classification | Internal Product Brief |
| Full Specification Reference | `prompter/project.md`, root `AGENTS.md`, and product specs under `prompter/specs/` |
