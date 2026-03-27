# Change: Add JR Club MVP — Sports Activity PWA

## Why

Jasa Raharja's sports community currently has no centralized platform to organize activities, run leagues, or track performance. JR Club will be a PWA mobile app that enables members to create and join sport activities (Padel, Basketball, Futsal, etc.), compete in leagues with live scoring, and track rankings through leaderboards.

## What Changes

- Add user authentication with member and admin roles
- Add sport activity creation, discovery, and joining
- Add team management with rosters
- Add league and competition management with schedules and standings
- Add real-time live scoring during matches
- Add leaderboard and ranking system
- Add PWA push notifications for reminders and updates
- Add user profiles with activity history and stats

## Impact

- Affected specs: user-auth, sport-activities, team-management, leagues, live-scoring, leaderboards, push-notifications, user-profiles (all new)
- Affected code: Entire application (greenfield project)
- Tech stack: React (Vite) + TypeScript + Tailwind CSS + Convex (self-hosted) + Docker
