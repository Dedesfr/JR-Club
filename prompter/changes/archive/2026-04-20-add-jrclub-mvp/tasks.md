## 0. UI Reference
> Before implementing any page, read the corresponding template in `template/<name>/code.html`.
> The design system tokens are in `prompter/design-system.md`.
> Screens: `template/<name>/screen.png` for visual reference.

## 1. Project Setup
- [x] 1.1 Scaffold Laravel project: `composer create-project laravel/laravel:^12.0`
- [x] 1.2 Install Inertia.js server-side adapter (`inertiajs/inertia-laravel`)
- [x] 1.3 Install Laravel Breeze with Inertia + React + TypeScript stack
- [x] 1.4 Configure Tailwind CSS
- [x] 1.5 Install and configure Laravel Reverb (`php artisan reverb:install`)
- [x] 1.6 Configure Vite PWA plugin (`vite-plugin-pwa`) with web manifest and service worker
- [x] 1.7 Set up Docker Compose: PHP-FPM, nginx, PostgreSQL, Reverb, queue worker
- [x] 1.8 Configure `.env` for PostgreSQL and Reverb
- [x] 1.9 Define all database migrations (see design.md data model)
- [x] 1.10 Define Eloquent models with relationships

## 2. User Authentication
> Template: `template/authentication_login/code.html`
- [x] 2.1 Scaffold auth via Laravel Breeze (register, login, logout, password reset)
- [x] 2.2 Add `role` column to users table (member|admin) with migration
- [x] 2.3 Define Laravel Gates/Policies for admin-only actions
- [x] 2.4 Seed default admin user
- [x] 2.5 Implement login page matching template (gradient background, bottom-border inputs, "Request access" link)

## 3. User Profiles
> Template: `template/user_profile/code.html`
- [x] 3.1 Create profile page (Inertia React) — name, email, role, stats
- [x] 3.2 Implement profile edit (name update)
- [x] 3.3 Add activity history section to profile page
- [x] 3.4 Create public profile view for other users (hide email)

## 4. Sport Activities
> Template: `template/sport_activities_feed/code.html`
- [x] 4.1 Seed sports data (Padel, Basketball, Futsal, Badminton, Volleyball)
- [x] 4.2 Create ActivityController with index, show, store, update, destroy
- [x] 4.3 Create activity list page (Inertia React) with sport type filter
- [x] 4.4 Create activity creation form page (admin only)
- [x] 4.5 Create activity detail page with participant list
- [x] 4.6 Implement join activity action + auto-full status on last spot
- [x] 4.7 Implement leave activity action
- [x] 4.8 Implement admin status management (complete, cancel)

## 5. Team Management
> Template: `template/team_management/code.html`
- [x] 5.1 Create TeamController with CRUD
- [x] 5.2 Create team creation form (admin only)
- [x] 5.3 Implement add/remove roster member (admin only)
- [x] 5.4 Create team detail page with roster
- [x] 5.5 Create "My Teams" page listing user's teams

## 6. Leagues & Competitions
> Template: `template/leagues_competitions/code.html`
- [x] 6.1 Create LeagueController with CRUD
- [x] 6.2 Create league creation form (admin only)
- [x] 6.3 Implement team registration to league (admin, sport-type validated)
- [x] 6.4 Create match scheduling interface (admin)
- [x] 6.5 Implement standings computation (Eloquent aggregation query)
- [x] 6.6 Create league detail page (schedule, standings tabs)
- [x] 6.7 Implement league status transitions (upcoming → active → completed)

## 7. Live Scoring
> Template: `template/live_match_detail/code.html`
- [x] 7.1 Create MatchController with start, update-score, end actions
- [x] 7.2 Define `MatchScoreUpdated` broadcast event (Reverb channel)
- [x] 7.3 Create live scoring admin interface (increment/decrement scores)
- [x] 7.4 Create real-time match viewer page using `Echo.channel()` in React
- [x] 7.5 Implement end match — finalize score, recalculate standings

## 8. Leaderboards
> Template: `template/leaderboards/code.html`
- [x] 8.1 Create league leaderboard page (standings from league query)
- [x] 8.2 Create overall leaderboard page filtered by sport type
- [x] 8.3 Add player stats computation (activities joined, matches played, win rate)

## 9. Push Notifications
- [x] 9.1 Implement Web Push permission flow in React (service worker + subscription)
- [x] 9.2 Store push subscription JSON on user record
- [x] 9.3 Create `SendPushNotification` queued job
- [x] 9.4 Dispatch notifications for: new activity created, activity reminder, activity cancelled
- [x] 9.5 Dispatch notifications for: match starting, match result

## 10. PWA & Mobile UX
- [x] 10.1 Design mobile-first navigation (bottom tab bar)
- [x] 10.2 Create home/dashboard screen (upcoming activities, active leagues, live matches)
- [x] 10.3 Configure Workbox caching strategy for offline shell
- [x] 10.4 Add PWA install prompt
- [x] 10.5 Test on iOS Safari 16.4+ and Android Chrome

## Post-Implementation
- [x] Update AGENTS.md in the project root for new changes in this specs
