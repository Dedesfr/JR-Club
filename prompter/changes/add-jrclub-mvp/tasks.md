## 1. Project Setup
- [ ] 1.1 Scaffold React + Convex project with `npm create convex@latest`
- [ ] 1.2 Configure TypeScript, Tailwind CSS, and project structure
- [ ] 1.3 Set up Vite PWA plugin with service worker and manifest
- [ ] 1.4 Set up Docker Compose for self-hosted Convex backend
- [ ] 1.5 Configure Convex schema with all data models

## 2. User Authentication
- [ ] 2.1 Implement Convex Auth with email/password
- [ ] 2.2 Create registration page
- [ ] 2.3 Create login page
- [ ] 2.4 Implement role-based access control (member/admin)
- [ ] 2.5 Create protected route wrapper
- [ ] 2.6 Implement logout functionality

## 3. User Profiles
- [ ] 3.1 Create user profile page (view own profile)
- [ ] 3.2 Create public profile view (other users)
- [ ] 3.3 Implement profile edit (name)
- [ ] 3.4 Add activity history section

## 4. Sport Activities
- [ ] 4.1 Define sports data (Padel, Basketball, Futsal, etc.)
- [ ] 4.2 Create activity creation form (admin only)
- [ ] 4.3 Create activity list page with sport type filter
- [ ] 4.4 Create activity detail page
- [ ] 4.5 Implement join/leave activity functionality
- [ ] 4.6 Implement activity status management (open, full, completed, cancelled)

## 5. Team Management
- [ ] 5.1 Create team creation form (admin only)
- [ ] 5.2 Implement team roster management (add/remove members)
- [ ] 5.3 Create team detail page
- [ ] 5.4 Create "My Teams" page for members

## 6. Leagues & Competitions
- [ ] 6.1 Create league creation form (admin only)
- [ ] 6.2 Implement team registration to leagues
- [ ] 6.3 Create match scheduling interface
- [ ] 6.4 Implement league standings computation
- [ ] 6.5 Create league detail page with schedule and standings
- [ ] 6.6 Implement league status management (upcoming, active, completed)

## 7. Live Scoring
- [ ] 7.1 Implement start match functionality (admin)
- [ ] 7.2 Create live scoring interface (admin updates score)
- [ ] 7.3 Create real-time match viewer using Convex subscriptions
- [ ] 7.4 Implement end match with final score and standings recalculation

## 8. Leaderboards
- [ ] 8.1 Create league leaderboard page
- [ ] 8.2 Implement overall leaderboard by sport type
- [ ] 8.3 Add player statistics computation and display

## 9. Push Notifications
- [ ] 9.1 Implement Web Push API permission flow
- [ ] 9.2 Set up push notification subscription storage
- [ ] 9.3 Implement activity notifications (new activity, reminder, cancelled)
- [ ] 9.4 Implement match notifications (starting, score updates, completed)

## 10. PWA & Mobile UX
- [ ] 10.1 Design and implement mobile-first navigation (bottom tab bar)
- [ ] 10.2 Create home/dashboard screen
- [ ] 10.3 Ensure offline shell with service worker caching
- [ ] 10.4 Add install prompt for PWA
- [ ] 10.5 Test on iOS Safari and Android Chrome

## Post-Implementation
- [ ] Update AGENTS.md in the project root for new changes in this specs
