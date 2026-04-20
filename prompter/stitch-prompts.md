# JR Club PWA - Stitch Prompts

This document contains optimized UI prompts for the core pages of the JR Club Progressive Web App. These are designed to be copied directly into UI generation tools like **Stitch**, ensuring 100% adherence to the "Rahardja Kinetic" design system.

---

## 🎨 Global Design System Details (Common to all prompts)

*When prompting Stitch, you can append this block to the end of any of the page structures below.*

```markdown
**DESIGN SYSTEM (REQUIRED):**
- Platform: Web, Mobile-first (PWA layout)
- Theme: Light, "The Active Authority"
- Background Options: 
  - Global Surface: Light Gray (#f7f9fb)
  - Surface Container Lowest (Cards/Modals): Pure White (#ffffff)
  - Surface Container Low (Inset Blocks/Inputs): Soft Gray (#f2f4f6)
  - Surface Container High (Tables): Darker Gray (#e6e8ea)
  - Inverse Surface (Scoreboards): Deep Gray/Black (#2d3133)
- Colors:
  - Primary Accent: Deep Blue (#0056a4) for primary actions, active tabs
  - Primary Container: Active Blue (#006ecf) for interactive surfaces
  - On-Primary: Pure White (#ffffff) for text on primary buttons
  - Text Primary (On-Surface): Near Black (#191c1e) - NEVER use pure black
  - Text Secondary (On-Surface Variant): Dark Gray (#414752)
  - Outline Variant: (#c1c6d5) at 20% opacity for ghost borders
- Typography: 'Inter' (sans-serif)
  - Headings: tracking-tight text, font-bold
  - Metadata labels: font-bold, tracking-[0.05em], ALL CAPS, text-[0.6875rem]
  - Scoreboards: font-black, tracking-[-0.02em]
- Border Radius:
  - Inputs/Default: 0.25rem
  - Tables/Insets: 0.5rem (lg)
  - Cards: 0.75rem (xl)
  - Nav/Pills/Chips: 9999px (full)
- Interactive: Use `active:scale-[0.98]` on tappable cards/buttons
- Gradients: `bg-gradient-to-br from-primary to-primary-container` for CTA buttons
- Glassmorphism: `bg-white/85 backdrop-blur-md` for the sticky header and floating bottom nav
- Shadows: Card ambient `[0px_12px_32px_rgba(15,23,42,0.04)]`, CTA hover `[0px_12px_24px_rgba(0,86,164,0.25)]`
- Layout spacing: No 1px dividers. Use background shifts instead to separate list items.
```

---

## 1. Login Screen

```markdown
A clean, trustworthy, mobile-first authentication page for an internal corporate sports club. 

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Background:** Clean `surface` background spanning the whole screen.
2. **Hero Branding:** Centered JR Club corporate logo above a large "Welcome Back" headline and subtext.
3. **Login Card:** Elevated pure-white card (`surface-container-lowest` with `xl` rounded corners and ambient shadow) containing the form.
4. **Form Inputs:** Email and Password fields. MUST use bottom-border editorial style: `bg-surface-container-low` background, no side/top borders, but a bottom border of `outline-variant/20` that turns `primary` on focus.
5. **CTA:** Full-width, pill-rounded (full) submit button using the primary deep blue gradient and heavy drop shadow.
6. **Footer Links:** A minimal "Need help signing in?" link leveraging the primary text color, centered at the bottom of the form card.
```

---

## 2. Activity Feed (Main Dashboard)

```markdown
A dynamic, mobile-first activity feed that serves as the entry point for sporting sessions. 

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header:** Top navigation with glassmorphism, user avatar on the left, corporate logo centered, notification bell on the right.
2. **Greeting:** Headline "Ready to play, [Name]?" with a sub-header and a small "Create Activity" CTA gradient pill.
3. **Filter Navigation:** Horizontal scrolling row of pill-shaped Sport Filter Chips: "All Sports" (active primary UI), "Padel", "Basketball", "Futsal" (inactive surface lowest UI).
4. **Activity Cards List:** Vertical stack of cards (`xl` border-radius, pure white). Inside each card:
   - Header with rounded sport icon and ALL CAPS metadata label ("TODAY, 18:00").
   - Title text (Headline, bold).
   - Inset Location Block (soft gray background `surface-container-low` with venue info).
   - Footer with overlapping participant avatars and a "Join" pill button.
5. **Floating Bottom Tab Bar:** Fixed at the screen bottom, pill-shaped, glassmorphism. Four tabs with icons + tiny text (`text-[10px]`): Activities (Active), Leagues, Rankings, Profile. 
```

---

## 3. Leagues & Competitions 

```markdown
A competitive overview page showcasing active and upcoming team leagues.

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header:** Top navigation with glassmorphism, "Leagues" page title centered.
2. **Tab / Filter Section:** Horizontal segment control for "Upcoming", "Active", and "Completed" leagues.
3. **League Cards:** Main list of competitions. Each card (`surface-container-lowest`, `xl` radius) contains:
   - Sport Badge/Pill on the top right.
   - Large bold title ("Q3 Basketball Corporate Cup").
   - Timeline metadata label ("OCT 1 - NOV 30").
   - A list or row of mini team logos/avatars showing participating teams.
   - "View Standings" text action element.
4. **Floating Bottom Tab Bar:** Standard PWA bottom navigation (Leagues tab is active).
```

---

## 4. Live Match Detail

```markdown
A high-contrast realtime scoreboard and match dashboard with a focus on live score updates.

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header:** Back arrow on the left, "Match Details" centered.
2. **High-Contrast Scoreboard:** A standout block using the `inverse-surface` (dark slate/black) background with `inverse-on-surface` text. Huge bold numbers with tight tracking for the score. Team A vs Team B avatars on sides. ALL CAPS metadata label at bottom: "LIVE" (perhaps with a red pulse indicator).
3. **Context Data:** A soft gray inset block (`surface-container-low`, `lg` radius) containing location, court number, and refs.
4. **Match Timeline/Events:** Vertical timeline list below the scoreboard indicating sets or points won chronologically. Separate event rows with background color shifts, NOT 1px borders.
5. **Admin CTA (Fixed Bottom Overlay):** If active, a massive full-width Primary gradient CTA at the bottom to "Update Score" or "End Match". 
```

---

## 5. Team Management

```markdown
An administrative view of a team's roster, focused on roster adjustments and stats.

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header:** Default PWA top shell.
2. **Hero Card:** Pure white `surface-container-lowest` box showing the Team Name (Large Headline), Sport Category Badge, and large stat numbers (e.g., "12 Players", "2 Trophies").
3. **Roster List Section:** List of members. 
   - No 1px borders between rows. Instead, alternate background colors or rely purely on layout spacing and small padding arrays.
   - Each row shows: Avatar, Name, Email (caption), and a role chip (e.g., "Captain" or "Member").
   - A trailing action icon (vertical ellipses) per row.
4. **Action Area:** Floating or embedded large CTA (primary gradient) to "Add Member" to the roster.
5. **Floating Bottom Tab Bar.**
```

---

## 6. Leaderboards (Rankings)

```markdown
A highly scannable standings and ranking table for league tracking.

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header & Bottom Tab Bar:** Standard PWA shell layout (Rankings tab active).
2. **Top Filter Area:** Large "Leaderboards" title, underneath are drop-downs or chips to filter by "League" or "Overall Sport".
3. **Top 3 Podium Visua**l: Visually elevated top 3 players/teams with avatars, perhaps utilizing the `tertiary` (bronze/orange) tokens for accenting #1, #2, #3.
4. **Standings Table:** Housed in a `surface-container-high` (darker gray) block with `lg` radius to make it feel inset.
   - Alternating row background colors (`surface-container-lowest` / `surface-container-low`) instead of lines.
   - The user's active row MUST be highlighted dynamically using `bg-primary` text `on-primary` so they can easily find themselves.
   - Columns: Rank, Avatar, Team Name, P, W, D, L, Pts.
```

---

## 7. User Profile

```markdown
A personal summary page displaying user history, stats, and settings.

[INSERT DESIGN SYSTEM BLOCK HERE]

**Page Structure:**
1. **Sticky Header & Bottom Tab Bar:** Standard PWA shell layout (Profile tab active).
2. **Profile Header Layout:** Centered huge user avatar, full Name, and Title/Department. Include a prominent visual badge representing their overall "Win Rate %" or "Total Activities".
3. **Stats Grid:** A 2-column or 3-column grid (`surface-container-low` blocks) summarizing lifetime stats: "Matches Played", "Teams Joined", "Activities Attended".
4. **Actions/Settings Menu:** A list of large touch targets for sub-pages.
   - "My Teams"
   - "Match History"
   - "Push Notification Preferences" (includes toggle switch styling without borders)
   - "Log Out" (maybe using secondary or outline colors)
```
