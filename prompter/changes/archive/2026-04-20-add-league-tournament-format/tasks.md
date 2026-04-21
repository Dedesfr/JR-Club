## 1. Schema & Models
- [x] 1.1 Write migration adding league tournament columns, `users.gender`, nullable match team columns, and new tables `league_entries`, `league_groups`, `league_group_entries`, `match_sets`.
- [x] 1.2 Create `LeagueEntry`, `LeagueGroup`, `LeagueGroupEntry`, `MatchSet` Eloquent models with relations.
- [x] 1.3 Extend `League` and `GameMatch` models with new fillable fields, relations, and helpers; replace `League::standings()` with a service-backed accessor for group-stage points.
- [x] 1.4 Run `php artisan migrate:fresh --seed` and confirm success.

## 2. Domain Services
- [x] 2.1 Implement `LeagueFormatService::divisionOptions(int $total)` returning valid (group_count, group_size) pairs.
- [x] 2.2 Implement `LeagueFormatService::createGroups` (snake-seed distribution) and `generateGroupMatches` (full round-robin per group).
- [x] 2.3 Implement `LeagueFormatService::recomputeGroupPoints` (+1 per win from completed matches).
- [x] 2.4 Implement `BracketService::seedBrackets` supporting byes for non-power-of-2 sizes.
- [x] 2.5 Implement `BracketService::advanceWinner` that writes winners into `next_match_id` slots.
- [x] 2.6 Unit tests covering division options, pairing counts, bracket shapes with 4/5/8 entries.

## 3. Admin Backend
- [x] 3.1 Add `/admin` route group gated by `auth` + `can:admin`.
- [x] 3.2 Implement `Admin/DashboardController` returning KPI counts.
- [x] 3.3 Implement `Admin/LeagueController` (index/create/store/show/update/destroy) with category + format fields.
- [x] 3.4 Implement `Admin/LeagueEntryController` enforcing gender rules per category; support optional substitute.
- [x] 3.5 Implement `Admin/LeagueGroupController` (configure groups, generate matches, set manual tiebreak rank).
- [x] 3.6 Implement `Admin/LeagueBracketController` (seed upper/lower brackets from admin-selected entries).
- [x] 3.7 Implement `Admin/LeagueMatchController` for set-by-set scoring, finalization, and bracket/standings updates.
- [x] 3.8 Implement stub list/CRUD controllers for Sports/Activities/Users/Teams.
- [x] 3.9 Update `MatchScoreUpdated` event payload to include current set and progression data.
- [x] 3.10 Feature test: end-to-end admin tournament flow with two champions.

## 4. Admin UI
- [x] 4.1 Build `AdminLayout.tsx` using `prompter/design-system.md` tokens.
- [x] 4.2 Build `Admin/Dashboard.tsx` with KPI cards.
- [x] 4.3 Build `Admin/Leagues/Index.tsx` and `Create.tsx`.
- [x] 4.4 Build `Admin/Leagues/Show.tsx` with Overview / Participants / Groups / Bracket / Matches tabs.
- [x] 4.5 Build `EntryPicker.tsx` with gender-filtered user search and substitute slot.
- [x] 4.6 Build `DivisionPicker.tsx` and `GroupTable.tsx` (with manual tiebreak control).
- [x] 4.7 Build `BracketTree.tsx` for admin edit + member read-only.
- [x] 4.8 Build `SetScoreEntry.tsx` modal with Reverb live updates.
- [x] 4.9 Build stub list pages for Sports, Activities, Users, Teams.
- [x] 4.10 Render `BracketTree` read-only on public `Leagues/Show.tsx` when brackets exist.
- [x] 4.11 Validate the full MS tournament flow with automated end-to-end coverage for 8 entries, 2 groups of 4, and upper/lower finals.

## Post-Implementation
- [x] Update `AGENTS.md` with new admin routes and badminton league fields.
- [x] Confirm no new design tokens were introduced, so `prompter/design-system.md` regeneration is not required.
- [x] Run `prompter validate add-league-tournament-format --strict --no-interactive` — zero issues.
