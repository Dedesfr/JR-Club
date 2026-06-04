## 1. Foundation
- [x] 1.1 Migration: add nullable `match_format` string to `leagues` — `database/migrations/`
- [x] 1.2 Create `MatchFormat` registry (set target, deuce flag, completion mode, defaults lookup) — `app/Support/MatchFormat.php`
- [x] 1.3 Add `match_format` to `$fillable` and add `formatRules()` helper — `app/Models/League.php`

## 2. Backend Logic
- [x] 2.1 Format-aware set validation in `store`/`updateSet` (deuce win-by-2, target points, reject sets beyond N for `all_sets`/`single_block`) — `app/Http/Controllers/Admin/LeagueMatchController.php`
- [x] 2.2 Rewrite `recomputeMatchOutcome` to branch on completion mode (`first_to_win` / `all_sets` / `single_block`) — `app/Http/Controllers/Admin/LeagueMatchController.php`
- [x] 2.3 Validate and persist `match_format` on league create/update — `app/Http/Controllers/Admin/LeagueController.php`

## 3. Frontend
- [x] 3.1 Add `match_format` to League type — `resources/js/types/jrclub.ts`
- [x] 3.2 Format dropdown that prefills sets/points on create — `resources/js/Pages/Admin/Leagues/Create.tsx`
- [x] 3.3 Format dropdown in edit panel — `resources/js/Pages/Admin/Leagues/Show.tsx`
- [x] 3.4 Format label + deuce-aware "first to N" hint — `resources/js/Pages/Matches/Show.tsx`

## 4. Tests
- [x] 4.1 Tenis Meja deuce: 11–9 valid, 11–10 rejected, 12–10 valid — `tests/Feature/`
- [x] 4.2 Padel `all_sets`: match stays live until all N sets recorded; winner = more sets won
- [x] 4.3 Americano `single_block`: completes on one block to 21
- [x] 4.4 Regression: badminton (null `match_format`) still completes at `sets_to_win`

## Post-Implementation
- [x] Update AGENTS.md in the project root for the new match-format behavior
