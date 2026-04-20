# JR Club — Stitch Prompts for All Pages

These prompts are optimized for the Stitch Prompt Enhancer pipeline. They cover the complete MVP list defined in `project-plan.md` using the PT Jasa Raharja Design System. You can paste these directly into Stitch to generate your application's UI components file-by-file.

---

## 1. Authentication (Login / Register)

A clean, trustworthy login and registration page for JR Club, maintaining BUMN standard security and professionalism.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, professional, minimalistic
- Background: Surface Slate (#F8FAFC)
- Primary Accent: BUMN Blue (#006ECF) for primary buttons
- Text Primary: Near Black (#0F172A)
- Text Secondary: Muted Slate (#64748B)
- Form Elements: Rounded-md (6px), 1px solid border (#CBD5E1), smooth shadow on focus
- Typography: Inter font family

**Page Structure:**
1. **Header:** Minimal top area, no navigation, just a large, crisp JR Club logo centered.
2. **Auth Card:** A white (#FFFFFF) elevated card (rounded-2xl, shadow-lg) centered on the screen.
3. **Form Fields:** Stacked inputs with labels for Email and Password. Include subtle placeholder text and standard field outlines.
4. **Action Area:** Full-width "Sign In" button in solid BUMN Blue.
5. **Footer:** "Forgot Password?" link and "Don't have an account? Register" link using text-sm text and BUMN Blue accent.

---

## 2. Sport Activities (Explore & Join)

A dynamic feed of sports activities allowing users to browse, filter, and join upcoming sessions.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, active, engaging
- Background: Base White (#FFFFFF)
- Primary Accent: BUMN Blue (#006ECF)
- Secondary Accent: Deep BUMN Blue (#003869)
- Text Primary: Near Black (#0F172A)
- Text Secondary: Muted Slate (#64748B)
- Cards: Softly rounded (16px), subtle shadow (shadow-sm)
- Typography: Inter font family

**Page Structure:**
1. **Header:** Standard sticky header with Title "Activities" and a "+" icon on the right to create a new activity.
2. **Filters (Sticky):** Horizontal scrolling pill badges for sports types (All, Padel, Futsal, Basketball). The active pill uses BUMN Blue background with white text.
3. **Activity List:** A vertical scrollable list of activity cards.
4. **Activity Card Structure:** 
   - Top: Date, time, and sport type badge.
   - Middle: Location name and distance.
   - Bottom: Participant avatars (overlapping circles) and a "Join Session" primary button.
5. **Bottom Navigation (z-50):** Sticky tab bar highlighting the "Activities" icon.

---

## 3. Team Management (Team Roster)

A focused dashboard for managing sports team rosters, viewing team stats, and interacting with teammates.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, professional, engaging
- Background: Base White (#FFFFFF), Surface Slate (#F8FAFC) for cards
- Primary Accent: BUMN Blue (#006ECF)
- Brand Gradient: `linear-gradient(180deg, #006ECF 0%, #003869 100%)`
- Text Primary: Near Black (#0F172A)
- Cards: Rounded-2xl (16px)
- Typography: Inter font family

**Page Structure:**
1. **Header:** Transparent header with back button and "Team Profile" title.
2. **Team Hero:** Brand gradient background. Centered team logo/avatar, team name in large bold white text, and a subtitle showing the primary sport.
3. **Team Stats Strip:** Three horizontal metric blocks (Matches Played, Win Rate, Total Points) directly below the hero.
4. **Roster Section:** Section title "Roster". A vertical list of team members with their avatar, name, and role badge (e.g., Captain, Player).
5. **Upcoming Matches:** A horizontal scrolling section of upcoming match cards.
6. **Bottom Navigation (z-50):** Sticky tab bar.

---

## 4. Leagues & Competitions

A comprehensive tournament hub displaying league standings, upcoming fixtures, and group stages.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, structured, data-heavy
- Background: Surface Slate (#F8FAFC)
- Primary Accent: BUMN Blue (#006ECF)
- Text Primary: Near Black (#0F172A)
- Text Secondary: Muted Slate (#64748B)
- Typography: Inter font family

**Page Structure:**
1. **Header:** Top navigation with "Leagues" title.
2. **League Header Card:** Elevated card featuring the current active league logo, name, and season text.
3. **Tab Navigation:** Segmented control underneath the header with tabs: "Standings", "Fixtures", "Results". Highlight the active tab.
4. **Standings Table (Active Tab):** A clean data table showing Rank, Team Name, Played (P), Won (W), Drawn (D), Lost (L), and Points (Pts). Top 3 rows subtly highlighted to indicate promotion/winning slots.
5. **Recent Results (Preview):** A list of score cards for recently finished matches showing the two team logos and final score.
6. **Bottom Navigation (z-50):** Sticky tab bar highlighting "Leagues".

---

## 5. Live Scoring Detail (Active Match)

An immersive, real-time match view optimized for quick glances, live tracking, and high-contrast visibility.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: High-contrast, dark mode elements for the scoreboard, light for timeline
- Background: Base White (#FFFFFF)
- Primary Accent: BUMN Blue (#006ECF)
- Dark Block: Deep BUMN Blue (#003869)
- Text Primary: Near Black (#0F172A) on white, White (#FFFFFF) on dark block
- Typography: Inter font family

**Page Structure:**
1. **Header:** Minimal header with "Back" button and a pulsing red "Live Match" indicator.
2. **Scoreboard (Hero):** Large, high-contrast dark block. Two columns for Team A and Team B, featuring large team logos, big bold score numbers in white, and the current match time in the center.
3. **Match Events Timeline:** A vertical timeline connecting events like goals, fouls, and timeouts. Each event shows the minute, player name, and an event icon.
4. **Stats Comparison:** Side-by-side progress bars comparing team statistics (e.g., Possession, Shots on Goal).
5. **Live Commentary:** A scrollable list format styling instant updates.

---

## 6. Leaderboards (Global Rankings)

A competitive and engaging leaderboard page showcasing top performers and seasonal rankings across different sports.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, competitive, Gamified
- Background: Base White (#FFFFFF) for page, Surface Slate (#F8FAFC) for rows
- Primary Accent: BUMN Blue (#006ECF)
- Gold/Silver/Bronze Highlights: Subtle use of yellow/gray/orange for top 3
- Text Primary: Near Black (#0F172A)
- Typography: Inter font family

**Page Structure:**
1. **Header:** "Leaderboards" title with a filter icon for different seasons and sports on the right.
2. **Category Selector:** Horizontal scrolling pill badges for (Padel, Futsal, Basketball).
3. **Podium Section (Top 3):** Visual top 3 layout. Rank #1 is larger in the center, #2 left, #3 right. Include player/team avatars, names, and points.
4. **Rankings List:** A continuous vertical list from Rank #4 downwards. Each row clearly displays the rank number, avatar, name, and total points aligned to the right. Apply a subtle light blue background highlight to the current user's row.
5. **Bottom Navigation (z-50):** Sticky tab bar highlighting the Leaderboard.

---

## 7. User Profile

A personal profile page summarizing a user's activity history, sports preferences, and community stats.

**DESIGN SYSTEM (REQUIRED):**
- Platform: Mobile PWA, Mobile-first
- Theme: Light, clean, data-oriented
- Background: Base White (#FFFFFF)
- Primary Accent: BUMN Blue (#006ECF)
- Text Primary: Near Black (#0F172A)
- Text Secondary: Muted Slate (#64748B)
- Borders: (#E2E8F0)
- Typography: Inter font family

**Page Structure:**
1. **Header:** "Profile" title with a "Settings" gear icon on the right.
2. **Profile Hero:** Circular user avatar, full name, employee/member ID, and a "Edit Profile" outline button.
3. **Activity Summary Metric:** Grid of 4 small cards: Total Sessions, Teams Joined, Tournaments Played, and Win Rate. Highlighting numbers in BUMN Blue.
4. **Favorite Sports:** A row of badges or icons indicating the user's preferred sports.
5. **Recent Match History:** A list view of the user's past 5 matches, showing the Date, Opponent, Result (Win/Loss badge), and Score.
6. **Bottom Navigation (z-50):** Sticky tab bar highlighting "Profile".
