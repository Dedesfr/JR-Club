## 1. Match locking & set management
- [x] 1.1 Add migration `add_locked_to_matches_table` introducing a boolean `locked` column (default false) and update `App\Models\GameMatch` with the cast, fillable, and an `isLocked()` helper
- [x] 1.2 Extract score/status recomputation in `App\Http\Controllers\Admin\LeagueMatchController::store` into a private `recomputeMatchOutcome` helper, and reject new sets when the match is locked
- [x] 1.3 Add `updateSet(GameMatch $match, MatchSet $set)` and `destroySet(GameMatch $match, MatchSet $set)` to the admin match controller; both reject when locked, both call the recompute helper, and `destroySet` re-numbers remaining `set_number`s inside a transaction
- [x] 1.4 Add `lock(GameMatch $match)` and `unlock(GameMatch $match)` actions that flip the flag (lock is only valid when status is `live` or `completed`)
- [x] 1.5 Register the new admin routes in `routes/web.php`: `PATCH/DELETE /admin/matches/{match}/sets/{set}` and `POST /admin/matches/{match}/{lock,unlock}`

## 2. Standings score difference
- [x] 2.1 In `App\Services\LeagueFormatService::standings` accumulate `score_against` per entry and return a signed `score_difference` field alongside `score`
- [x] 2.2 In `teamStandings` return `score_difference` (`goals_for` − `goals_against`) in each row
- [x] 2.3 Update `resources/js/Pages/Leagues/Show.tsx` standings table(s) to render a new "SD" column with a signed value and update the TypeScript prop types

## 3. Admin match UI
- [x] 3.1 In `resources/js/Pages/Matches/Show.tsx` surface lock/unlock controls and a "Locked" indicator for admin viewers, and hide the "add set" form when the match is locked
- [x] 3.2 Add edit and delete affordances on each set row (admin only) that hit the new set endpoints

## 4. Member dashboard
- [x] 4.1 Create `App\Http\Controllers\DashboardController` (single-action) returning Inertia `Dashboard` with the signed-in user's upcoming matches, recent results, teams, and ongoing leagues
- [x] 4.2 Replace the `/dashboard` redirect in `routes/web.php` with the new controller
- [x] 4.3 Rewrite `resources/js/Pages/Dashboard.tsx` as a member dashboard using design-system tokens, mobile-first, with sections for upcoming matches, recent results, my teams, and ongoing competitions

## 5. Remove featured highlights
- [x] 5.1 Remove the featured/banner highlight styling from `resources/js/Pages/Leagues/Index.tsx`
- [x] 5.2 Remove the featured/banner highlight styling from `resources/js/Pages/Activities/Index.tsx`

## 6. Tests & verification
- [x] 6.1 Add Pest feature tests in `tests/Feature/Admin/LeagueMatchTest.php` covering: locked match rejects set add/edit/delete, lock/unlock toggles, set delete re-numbers, set edit recomputes scores and broadcasts
- [x] 6.2 Run `php artisan test` and `npm run build`
- [x] 6.3 Browser smoke test: admin lock/edit/delete flow, member dashboard, standings SD column, leagues/activities listings render without featured styling
