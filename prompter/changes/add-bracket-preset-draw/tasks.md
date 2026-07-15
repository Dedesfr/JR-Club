## 1. Database & Model
- [x] 1.1 Add migration `database/migrations/*_add_bracket_preset_to_leagues_table.php` adding to `leagues`: `bracket_preset_enabled` (boolean, default false), `bracket_preset_reveal_at` (unsignedInteger, nullable), `bracket_seed_count` (unsignedInteger, default 0), `bracket_preset_slots` (json, nullable)
- [x] 1.2 Add the four columns to `$fillable` and `casts()` (`boolean`, `integer`, `integer`, `array`) in `app/Models/League.php`

## 2. Backend
- [x] 2.1 Add `updatePreset(League $league)` to `app/Http/Controllers/Admin/LeagueBracketController.php`: authorize `update`; reject unless `start_stage = bracket`; validate `bracket_preset_enabled` (boolean), `bracket_preset_reveal_at` (`nullable|integer|min:1`, required when enabled), `bracket_preset_slots` (`nullable|array`) with each non-null slot `exists:league_entries,id` scoped to the league and no duplicate non-null ids; save and return `back()->with('success', ...)`
- [x] 2.2 Register `PATCH /admin/leagues/{league}/bracket/preset` → `brackets.preset.update` in `routes/web.php`
- [x] 2.3 In `store()` of `LeagueBracketController`, when `bracket_preset_enabled`: increment `bracket_seed_count`; if it reaches `bracket_preset_reveal_at`, pass the preset slot layout to the service and reset `bracket_seed_count` to 0; otherwise increment and seed normally
- [x] 2.4 In `app/Services/BracketService.php`, let `seedBrackets()`/`seedBracket()` accept an optional preset slot layout (array of entry ids / nulls) and, when present, assign first-round `home_entry_id`/`away_entry_id` directly from it instead of `seedSlots()`
- [x] 2.5 Ensure the new preset fields are exposed on the `league` payload in `app/Http/Controllers/Admin/LeagueController.php@show` (not hidden)

## 3. Frontend
- [x] 3.1 Extend the `League` type with `bracket_preset_enabled`, `bracket_preset_reveal_at`, `bracket_seed_count`, `bracket_preset_slots` in `resources/js/types`
- [x] 3.2 Add a Bracket Setting panel in `resources/js/Pages/Admin/Leagues/Show.tsx` (only when `startsFromBracket`): enable checkbox, reveal-at N input, one slot dropdown per first-round slot (count = next power of two of entries) with a BYE option and duplicate guard, a current-attempt-count display, and a reset-counter control; submit via `router.patch(route('admin.leagues.brackets.preset.update', league.id))`

## 4. Tests
- [x] 4.1 `tests/Feature/Admin/LeagueBracketPresetTest.php`: `updatePreset` persists settings; rejected for `start_stage = group`; rejects duplicate slot entries
- [x] 4.2 Seeding increments the counter; the Nth seed produces the preset arrangement and resets the counter to 0; non-Nth seeds are unchanged

## Post-Implementation
- [x] Update AGENTS.md in the project root for new changes in this specs
