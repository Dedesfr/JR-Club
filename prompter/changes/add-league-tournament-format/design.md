## Context
The existing `leagues` capability is built around teams and round-robin 3W/1D/0L scoring. Jasa Raharja needs to run internal badminton tournaments with per-category entries (singles and doubles), admin-assigned participants, dynamically sized group stages, and single-elimination upper + lower brackets. Admin workflows today are inline forms on public pages; this change introduces a dedicated `/admin` shell.

## Goals / Non-Goals
**Goals**
- Admin-only management of league participants; no self-join.
- Dynamic group sizing from a participant total (e.g., 16 → 2×8 or 4×4).
- +1 point per group-stage win; admin manually breaks ties when selecting who advances.
- Configurable cutoffs → upper and lower single-elimination brackets, each crowning its own champion.
- Set-by-set badminton scoring with configurable `sets_to_win` and `points_per_set`.
- Visual bracket UI (SVG tree) reused for admin editing and member viewing.
- Preserve backward compatibility for team-based leagues.

**Non-Goals**
- Deep CRUD for Sports/Activities/Users/Teams beyond list + basic forms (deferred).
- Walkovers, retirements, disqualifications in match flow.
- Public signup or invitation flows for league entries.
- Historical league data import.
- Internationalization beyond existing copy.

## Decisions

**Decision 1: One league = one category.**
Each League has a single `category` (MS/WS/MD/WD/XD) and derived `entry_type` (single|double). Admins create separate leagues per category when running a full tournament. Rationale: simpler schema and UI; matches admin's stated preference.

**Decision 2: Entries as first-class rows (`league_entries`).**
An entry holds `player1_id`, nullable `player2_id` (for doubles), nullable `substitute_id`. This decouples league participants from the `teams` table (which continues to back team-based leagues). Alternative considered: reuse `teams` with synthetic team rows — rejected because it muddies ownership and leaks badminton concerns into the Team domain.

**Decision 3: Matches table extended, team columns made nullable.**
Add `home_entry_id`/`away_entry_id`, `stage`, `round`, `bracket_slot`, `next_match_id`, `league_group_id`. Existing team-based matches keep `home_team_id`/`away_team_id`. A single `matches` table avoids a parallel schema and lets `MatchScoreUpdated` broadcast through one path. Trade-off: consumers must check which pair of columns is populated.

**Decision 4: Service layer owns tournament logic.**
`LeagueFormatService` and `BracketService` encapsulate group creation, pairing, and bracket progression. Controllers stay thin. Services are pure PHP and unit-testable without HTTP. This mirrors the project convention in `prompter/project.md` ("feature-based service classes, no fat controllers").

**Decision 5: Manual tiebreak via `manual_advance_rank`.**
When group-stage points tie, admins assign a numeric `manual_advance_rank` on `league_group_entries` before seeding brackets. Alternative considered: automated head-to-head — rejected because the user explicitly chose manual tiebreak.

**Decision 6: Dual single-elimination, not true double-elimination.**
Upper and lower brackets are independent single-elimination trees with separate winners (per user decision). This differs from classic double-elim where a loser drops to the lower bracket mid-run. Simplifies `BracketService` and the UI considerably.

**Decision 7: `users.gender` as authoritative filter.**
Category rules require it (MS=male, WS=female, MD=2 males, WD=2 females, XD=1M+1F). Added as nullable so existing users aren't blocked; admin fills it for anyone participating. Alternative considered: storing gender on the entry — rejected because it would duplicate per-league.

**Decision 8: Set-by-set scoring via `match_sets` table.**
One row per set with `home_points`, `away_points`. Match auto-completes when a side reaches `sets_to_win` sets won. Alternative: pack scores into a JSON column — rejected because SQL queries for stats become painful.

## Risks / Trade-offs
- **Two populated column families on `matches`** (team-based vs. entry-based). Mitigation: document clearly; controllers check `stage` before reading.
- **Non-power-of-2 bracket sizes need byes.** Mitigation: `BracketService` assigns top seeds a bye; covered by unit tests with 5-entry case.
- **Gender column is sensitive data.** Mitigation: only admins see and set it; no public exposure.
- **Increased admin UI surface.** Mitigation: ship stub list pages for non-league modules; iterate in a later increment.

## Migration Plan
1. Apply migration: `php artisan migrate`. Additive only; existing rows unaffected.
2. Backfill `users.gender` for admins who will participate in initial badminton leagues (manual).
3. Existing team-based leagues continue to function; new badminton leagues opt in.
4. Rollback: drop new tables and columns; `matches` team columns return to NOT NULL after backfilling.

## Open Questions
- Should the lower bracket be renamed in UI (e.g., "B-Flight" / "Plate") for member clarity? Deferred — ship as "Lower Bracket" initially.
- Should set-point mid-game edits (correction of a misrecorded set) be audited? Out of scope for this increment; noted for future.
