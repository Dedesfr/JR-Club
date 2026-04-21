## 1. Schema & Dependencies
- [x] 1.1 `composer require maatwebsite/excel` and publish its config.
- [x] 1.2 Write migration for `match_substitutions` (`match_id`, `entry_id`, `original_player_id`, `substitute_id`, `reason` nullable, `activated_at`).
- [x] 1.3 Write migration for `match_documents` (`match_id`, `path`, `original_name`, `uploaded_by`, timestamps).
- [x] 1.4 Write migration adding `leagues.third_place_match_id` FK → matches (nullable).
- [x] 1.5 Run `php artisan storage:link`; confirm `storage/app/public/matches/` writable.
- [x] 1.6 Run `php artisan migrate:fresh --seed` and verify success.

## 2. Domain Services
- [x] 2.1 Extend `BracketService::seedBrackets` to generate a third-place match when the upper bracket has semifinals and attach it to `League::third_place_match_id`.
- [x] 2.2 Extend `BracketService::advanceWinner` to populate the third-place match with the two losing upper-bracket semifinalists.
- [x] 2.3 Implement `BracketService::swapSlots(GameMatch $a, GameMatch $b, string $sideA, string $sideB)` — reject when any involved match already has scores.
- [x] 2.4 Unit tests: third-place generation for 4/8-entry brackets; swap rejects scored matches; swap succeeds on unscored matches.

## 3. Admin Backend
- [x] 3.1 `LeagueBracketController@shuffle` — POST `/admin/leagues/{league}/bracket/shuffle` accepting `{match_a_id, match_b_id, side_a, side_b}`.
- [x] 3.2 `LeagueGroupController@generateMatches` — accept `schedule[]` array of `{round, scheduled_at}`; apply to generated matches; fall back to league start date + +1 day per round when absent.
- [x] 3.3 `LeagueMatchController@updateSchedule` — PATCH `/admin/matches/{match}/schedule` with `scheduled_at` and `location`.
- [x] 3.4 `LeagueMatchController@substitute` — POST `/admin/matches/{match}/substitutions` with `{entry_id, original_player_id, substitute_id, reason}`; validate substitute belongs to entry's declared substitutes.
- [x] 3.5 `LeagueMatchController@uploadDocuments` — POST `/admin/matches/{match}/documents` (multipart); allow `image/jpeg|png|webp`; max 5MB per file; up to 10 files.
- [x] 3.6 `LeagueMatchController@destroyDocument` — DELETE `/admin/matches/{match}/documents/{document}`.
- [x] 3.7 `ParticipantImportExportController@template` — GET streams xlsx template with header row `player1_email, player2_email, substitute_emails, group_name`.
- [x] 3.8 `ParticipantImportExportController@import` — POST xlsx; run `LeagueParticipantsImport`; surface per-row validation errors without halting the whole import.
- [x] 3.9 `ParticipantImportExportController@export` — GET streams current participants xlsx.
- [x] 3.10 Register new routes in `routes/web.php` under the admin group guarded by `auth` + `can:admin`.
- [x] 3.11 Feature tests: shuffle endpoint (success + rejected-when-scored), substitute endpoint (success + non-declared sub rejected), photo upload (happy + oversize rejected), import (one bad row does not block rest), third-place match populated after semifinals finalize.

## 4. Admin & Member UI
- [x] 4.1 Extend `resources/js/Components/BracketTree.tsx` with a shuffle mode: select two empty or unscored slots and call the shuffle endpoint.
- [x] 4.2 Render the third-place match node beside the upper-bracket final in `BracketTree`.
- [x] 4.3 Add per-round date/time inputs to group-match generation (extend `DivisionPicker` or add a `GroupScheduleForm`).
- [x] 4.4 Update `resources/js/Pages/Admin/Leagues/Show.tsx` Matches tab: inline schedule edit; "Substitute" button → `SubstitutionModal`; "Photos" button → `PhotoUploader`.
- [x] 4.5 Build `resources/js/Components/SubstitutionModal.tsx` listing the entry's declared substitutes with a reason field.
- [x] 4.6 Build `resources/js/Components/PhotoUploader.tsx` with drag-drop, client-side preview, and per-photo delete.
- [x] 4.7 Build `resources/js/Components/ParticipantImportDialog.tsx` wired to download template, upload xlsx, and show per-row errors.
- [x] 4.8 Update `resources/js/Pages/Matches/Show.tsx` to display players (including active substitute), scheduled time, and a photo gallery.

## 5. Responsive Redesign
- [x] 5.1 Rework `resources/js/Layouts/JRClubLayout.tsx`: `md:` desktop sidebar variant, bottom nav hidden on `md:+`, main container `max-w-md md:max-w-5xl lg:max-w-6xl`.
- [x] 5.2 Rework `resources/js/Layouts/AdminLayout.tsx`: permanent sidebar on `lg:+`, collapsible on `md:`, mobile drawer toggle on `<md`.
- [x] 5.3 Update `resources/js/Pages/Activities/**`, `Leagues/**`, `Leaderboards/**`, `Matches/**`, `Profile/**`: grid `md:grid-cols-2 lg:grid-cols-3`; switch list cards to tables on `lg:` where data-dense.
- [x] 5.4 Update `resources/js/Pages/Admin/Leagues/Show.tsx`: tabs → sidebar on `lg:`; participants/groups tables expand columns on `lg:`.
- [x] 5.5 Manually smoke-test every top-level route at 375 px, 768 px, and 1280 px widths.

## 6. Specs & Docs
- [x] 6.1 Run `prompter validate add-admin-league-ops-and-responsive --strict --no-interactive` and resolve every issue.
- [x] 6.2 Run `php artisan test`.
- [x] 6.3 Update `AGENTS.md` with new admin routes and responsive behavior notes.

## Post-Implementation
- [x] Confirm every item above is `- [x]` before archiving.
- [x] Update `prompter/specs/**` when archiving (`prompter archive add-admin-league-ops-and-responsive --yes`).
- [x] Update `AGENTS.md` in the project root for new changes in these specs.
