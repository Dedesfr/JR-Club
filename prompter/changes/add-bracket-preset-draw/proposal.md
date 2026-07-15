# Change: Predetermined bracket draw (preset reveal) for bracket-start leagues

## Why
Admins running a live bracket draw want the seed to "land on" a specific, pre-arranged bracket after a set number of draw attempts — e.g. re-seed a few times for show, then have the intended matchups appear on the Nth click. Today seeding is deterministic/random with no way to force a chosen arrangement.

## What Changes
- Add a dedicated **Setup** tab to the admin league page holding a **Bracket Setting** panel, shown for tournament leagues (both `start_stage = bracket` and `start_stage = group`, since group play also progresses to a bracket).
- Admins can enable a per-tournament **bracket preset**, set a reveal number **N**, and pre-assign the exact first-round slot layout (each slot = a league entry or a BYE).
- Persist a **seed attempt counter** on the league. On each "Seed brackets" click the counter increments; when it reaches **N**, that seed uses the preset slot layout exactly (bypassing automatic bye placement) and the counter resets to `0`. All other seeds behave as today.
- Add a `PATCH /admin/leagues/{league}/bracket/preset` endpoint to save the settings, plus an admin control to reset the counter manually.

## Impact
- Affected specs: `leagues`
- Affected code:
  - `database/migrations/*_add_bracket_preset_to_leagues_table.php` (new)
  - `app/Models/League.php` (fillable + casts)
  - `routes/web.php` (new preset route)
  - `app/Http/Controllers/Admin/LeagueBracketController.php` (`updatePreset`, counter/preset branch in `store`)
  - `app/Services/BracketService.php` (optional preset slot layout)
  - `app/Http/Controllers/Admin/LeagueController.php` (expose preset fields)
  - `resources/js/Pages/Admin/Leagues/Show.tsx` + League type (setup panel/form)
  - `tests/Feature/Admin/LeagueBracketPresetTest.php` (new)
