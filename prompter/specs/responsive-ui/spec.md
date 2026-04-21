# responsive-ui Specification

## Purpose
TBD - created by archiving change add-admin-league-ops-and-responsive. Update Purpose after archive.
## Requirements
### Requirement: Breakpoint-Aware Layouts
The application SHALL render layouts tailored to three breakpoints — mobile (< 768 px), tablet (768–1023 px), and desktop (≥ 1024 px) — for both the member and admin shells.

#### Scenario: Mobile shell
- **WHEN** a user opens any page at a viewport under 768 px wide
- **THEN** the member shell shows the bottom navigation bar
- **AND** the main content column is capped at the mobile width defined in `prompter/design-system.md`

#### Scenario: Tablet shell
- **WHEN** a user opens any page at a viewport between 768 px and 1023 px wide
- **THEN** the admin shell renders a collapsible sidebar
- **AND** the member shell hides the bottom navigation and exposes the top navigation with sport and profile entry points

#### Scenario: Desktop shell
- **WHEN** a user opens any page at a viewport 1024 px wide or greater
- **THEN** the admin shell renders a permanent sidebar
- **AND** the main content expands to the desktop max-width defined in `prompter/design-system.md`

### Requirement: Data-Dense Views Adapt to Width
Pages displaying collections (activities, leagues, leaderboards, participants, matches) SHALL render as cards on mobile and as multi-column grids or tables at tablet and desktop widths.

#### Scenario: Leaderboard adapts
- **WHEN** a user views the leaderboard at mobile width
- **THEN** entries render as stacked cards

#### Scenario: Leaderboard desktop table
- **WHEN** a user views the same leaderboard at desktop width
- **THEN** entries render as a table with points, goal difference, and wins as separate columns

#### Scenario: Admin participants list desktop table
- **WHEN** an admin views the participants tab of a league at desktop width
- **THEN** participants render as a table with columns for player(s), substitute(s), group, and seed

