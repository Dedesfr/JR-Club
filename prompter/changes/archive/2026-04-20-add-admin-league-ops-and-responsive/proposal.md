# Change: Admin League Operations & Responsive Redesign

## Why
Admins managing Jasa Raharja badminton tournaments need richer controls (manual bracket shuffling, group scheduling, rich match details with player substitutions and photo documentation, Excel-driven participant onboarding, third-place matches) that the current admin area cannot express. Separately, the PWA is currently mobile-only; stakeholders operate it on desktops and tablets and need a full responsive layout.

## What Changes
- **ADD** manual bracket shuffle: admins swap entries between two unscored bracket slots in the upper or lower tree.
- **ADD** per-round group scheduling: generating group-stage matches accepts a `scheduled_at` value per group/round.
- **ADD** match substitutions: admins activate a declared substitute on a specific match; history is preserved via a new `match_substitutions` table.
- **ADD** match documentation: admins upload one or more photos per match (local `public` disk); stored via a new `match_documents` table.
- **ADD** participant Excel import/export: xlsx template download, bulk import that creates users + league entries, and export of current participants. Uses `maatwebsite/excel`.
- **ADD** third-place match: single-elimination brackets with semifinals auto-generate a third-place match populated from the upper-bracket semifinalist losers; result stored on `leagues.third_place_match_id`.
- **ADD** responsive layouts: full redesign per breakpoint (mobile ≤ md, tablet md–lg, desktop ≥ lg) for both `JRClubLayout` and `AdminLayout` and every Inertia page under `Pages/**`.
- **MODIFY** `Admin/Leagues/Show.tsx` Matches tab to surface player info, scheduled time, substitution action, and photo uploader.
- **BREAKING** — **MODIFY** `POST /admin/leagues/{league}/groups/{group}/matches` payload: now requires `schedule[]` entries of `{round, scheduled_at}` (fallback to league defaults if omitted).

## Impact
- **Affected specs:** `leagues`, `live-scoring`, new `responsive-ui`.
- **Affected code:**
  - Migrations: `match_substitutions`, `match_documents`, `leagues.third_place_match_id`.
  - Models: `MatchSubstitution`, `MatchDocument` (new); `GameMatch`, `League` (relations).
  - Services: `app/Services/BracketService.php` (third-place, `swapSlots`).
  - Controllers: `app/Http/Controllers/Admin/LeagueBracketController.php`, `LeagueMatchController.php`, `LeagueGroupController.php`, new `ParticipantImportExportController.php`.
  - Imports/Exports: `app/Imports/LeagueParticipantsImport.php`, `app/Exports/LeagueParticipantsExport.php`.
  - Frontend: `resources/js/Layouts/{JRClubLayout,AdminLayout}.tsx`; all `resources/js/Pages/**`; new components `MatchDetail`, `SubstitutionModal`, `PhotoUploader`, `ParticipantImportDialog`, extended `BracketTree`.
  - Routes: `routes/web.php` (new admin routes under `/admin/leagues/{league}`).
  - Dependency: `composer require maatwebsite/excel`.
- **Backwards compatibility:** existing leagues, entries, and scored matches continue to work. New columns are nullable; new tables are additive. `schedule[]` payload change is additive with defaults, so existing admin UI can still post without it.
