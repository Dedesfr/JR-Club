## 1. Database and Types
- [x] 1.1 Add a migration for `leagues.start_stage` with allowed values represented as strings and default `group`.
- [x] 1.2 Add `start_stage` to `App\Models\League` mass assignment.
- [x] 1.3 Add `start_stage?: 'group' | 'bracket'` to `resources/js/types/jrclub.ts`.

## 2. Backend Flow
- [x] 2.1 Validate and persist `start_stage` in `app/Http/Controllers/Admin/LeagueController.php` for create/update requests.
- [x] 2.2 Keep existing standings-based bracket seeding for `start_stage = group` leagues in `app/Http/Controllers/Admin/LeagueBracketController.php`.
- [x] 2.3 Add direct-entry bracket seeding for `start_stage = bracket` leagues in `app/Http/Controllers/Admin/LeagueBracketController.php`, requiring registered entries and no group records.
- [x] 2.4 Reset stale `third_place_match_id` and `lower_third_place_match_id` when reseeding brackets in `app/Services/BracketService.php`.

## 3. Admin UI
- [x] 3.1 Add a "Start from" selector to `resources/js/Pages/Admin/Leagues/Create.tsx`.
- [x] 3.2 Display and update the start-stage choice in the Overview tab of `resources/js/Pages/Admin/Leagues/Show.tsx`.
- [x] 3.3 Replace group generation controls with an explanatory empty state for bracket-start leagues in `resources/js/Pages/Admin/Leagues/Show.tsx`.
- [x] 3.4 Update bracket empty-state copy so bracket-start leagues direct admins to complete participants and seed brackets.

## 4. Validation
- [x] 4.1 Add a feature test for bracket-start direct seeding without groups in `tests/Feature/AdminTournamentFlowTest.php`.
- [x] 4.2 Confirm the existing group-to-bracket feature test still passes.
- [x] 4.3 Run `php artisan test tests/Feature/AdminTournamentFlowTest.php`.
- [x] 4.4 Run `npm run build` after frontend changes.

## Post-Implementation
- [x] Update `AGENTS.md` if the new `start_stage` convention should be documented for future agents.
