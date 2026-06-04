# Change: Add Padel & Tenis Meja match formats and rules

## Why
The current live-scoring engine is generic per-set (`sets_to_win` + `points_per_set`) and only models badminton-style first-to-majority matches. The rules in `rev-update.md` for Padel (Semi Klasik, Best of Three, Best of Five, Americano) and Tenis Meja (Best of Five, Best of Seven) introduce per-set deuce/win-by-2 validation, a play-all-N-sets completion mode, and a single-block (Americano) mode that the engine cannot represent today.

## What Changes
- Add a nullable `match_format` field to leagues, selectable in the create/edit forms; it prefills `sets_to_win` / `points_per_set` (both remain editable).
- Introduce a format registry (`MatchFormat`) as the single source of truth for each format's set target, deuce flag, and completion mode.
- Add per-set **deuce / win-by-2 validation** on score entry (Tenis Meja: 11, win by 2 above 10–10).
- Add three completion modes to match outcome recomputation:
  - `first_to_win` — ends at majority (Tenis Meja, badminton — existing behavior).
  - `all_sets` — plays all N sets, winner = more sets won (Padel Best of N).
  - `single_block` — one block to 21, higher score wins (Padel Americano).
- Match view displays the format label and a deuce-aware hint.
- **Non-breaking**: leagues with a null `match_format` keep the current `first_to_win` behavior; existing badminton leagues are unaffected.

## Impact
- Affected specs: `leagues` (Match Format selection), `live-scoring` (validation + completion modes)
- Affected code:
  - `database/migrations/` — add `match_format` to `leagues`
  - `app/Support/MatchFormat.php` (new) — format registry
  - `app/Models/League.php` — fillable + `formatRules()` helper
  - `app/Http/Controllers/Admin/LeagueMatchController.php` — set validation + `recomputeMatchOutcome`
  - `app/Http/Controllers/Admin/LeagueController.php` — validate/store `match_format`
  - `resources/js/types/jrclub.ts`, `Pages/Admin/Leagues/Create.tsx`, `Pages/Admin/Leagues/Show.tsx`, `Pages/Matches/Show.tsx`

## Open Questions
- `semi_klasik` has no win condition in `rev-update.md`; treated as `first_to_win` with an editable target pending confirmation.
- Completion mode is per-format (Padel = `all_sets`, Tenis Meja = `first_to_win`) to satisfy both the doc's Best-of-N result tables and the Tenis Meja "win at 3/4 sets" text.
