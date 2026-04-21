# Change: Admin Area + Dynamic Badminton League Format

## Why
The current League feature supports only team-vs-team round-robin and provides no dedicated admin interface. Jasa Raharja's internal badminton events need admin-managed tournaments with per-category entries (singles/doubles), auto-generated group stages, and upper/lower elimination brackets with a visual tree — all managed from a dedicated admin area.

## What Changes
- **ADD** `/admin` shell (layout + dashboard + sidebar) gated by the existing `admin` Gate.
- **ADD** stub admin list/CRUD pages for Sports, Activities, Users, Teams (deep CRUD deferred to a later increment).
- **BREAKING** — **MODIFY** League model to support badminton categories (MS/WS/MD/WD/XD), admin-assigned entries (1 or 2 players + optional substitute), configurable group count, and configurable upper/lower bracket cutoffs. Team-based leagues remain supported (nullable columns).
- **ADD** `league_entries`, `league_groups`, `league_group_entries`, `match_sets` tables.
- **MODIFY** `matches` table: add `stage` (group|upper|lower), `round`, `bracket_slot`, `next_match_id`, `league_group_id`, `home_entry_id`, `away_entry_id`; make team columns nullable.
- **ADD** `users.gender` column to support category gender rules.
- **ADD** `LeagueFormatService` (group creation, round-robin pairing, points recompute) and `BracketService` (single-elimination seeding and winner advancement for both upper and lower brackets).
- **ADD** admin endpoints to assign entries, configure groups, generate round-robin matches, manually break ties, seed brackets, and record set-by-set scores.
- **MODIFY** match scoring from two-integer final scores to per-set entry with admin-configurable `sets_to_win` and `points_per_set`. Reverb broadcast payload updated.
- **ADD** visual `BracketTree` component; used by admin for editing and by members for read-only viewing.

## Impact
- **Affected specs:** `leagues`, `live-scoring`, new capability `admin-area`.
- **Affected code:**
  - Migrations: new migration under `database/migrations/`
  - Models: `app/Models/League.php`, `GameMatch.php` (modify); `LeagueEntry.php`, `LeagueGroup.php`, `LeagueGroupEntry.php`, `MatchSet.php` (new)
  - Services: `app/Services/LeagueFormatService.php`, `BracketService.php` (new)
  - Controllers: `app/Http/Controllers/Admin/*` (new)
  - Events: `app/Events/MatchScoreUpdated.php` (modify payload)
  - Routes: `routes/web.php` (add `/admin` group)
  - Frontend: `resources/js/Layouts/AdminLayout.tsx`, `resources/js/Pages/Admin/**`, `resources/js/Components/{BracketTree,GroupTable,EntryPicker,SetScoreEntry,DivisionPicker}.tsx`
- **Backwards compatibility:** existing team-based leagues continue to work; new badminton leagues opt in via `category`/`entry_type` fields.
