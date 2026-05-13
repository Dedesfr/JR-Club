# Change: Add admin league match controls and member dashboard

## Why
Admins currently can only append sets to a match — they cannot edit a recorded set, delete one, or freeze the score once play has ended, which leaves bad data in standings and exposes completed matches to accidental changes. At the same time, the member experience drops people directly onto the leagues list with no personal context, league standings omit a per-entry score differential that tournament organisers use as a tiebreaker, and the visually emphasised "featured" cards on the leagues and activities listings add noise without serving a need that has emerged in practice.

## What Changes
- Add a `locked` flag to matches; admins can lock a live or completed match to prevent new sets and freeze edits, and unlock it to resume changes.
- Add admin endpoints to edit and delete individual `MatchSet` records, recomputing match scores/status and re-numbering remaining sets, both gated by the lock.
- Surface a "Score Difference" column in league standings (entry-based and team-based) computed as accumulated points-for minus points-against across completed-match sets.
- Replace the `/dashboard` redirect with a real member dashboard summarising the signed-in user's upcoming matches, recent results, teams, and ongoing competitions.
- Remove the "featured" highlight styling from the league index and the activity index so listings render uniformly.

## Impact
- Affected specs: `live-scoring`, `leagues`, `admin-area`
- Affected code:
  - Schema/model: new migration `add_locked_to_matches_table`, `app/Models/GameMatch.php`
  - Backend: `app/Http/Controllers/Admin/LeagueMatchController.php`, `app/Services/LeagueFormatService.php`, new `app/Http/Controllers/DashboardController.php`, `routes/web.php`
  - Frontend: `resources/js/Pages/Matches/Show.tsx`, `resources/js/Pages/Leagues/Show.tsx`, `resources/js/Pages/Leagues/Index.tsx`, `resources/js/Pages/Activities/Index.tsx`, `resources/js/Pages/Dashboard.tsx`
  - Tests: `tests/Feature/Admin/LeagueMatchTest.php`
