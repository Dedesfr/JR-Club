# Change: Branch-based admin & member scoping

## Why
JR Club is used across multiple Jasa Raharja branches (Pusat, DKI, Jateng, Lampung), but every admin currently manages all data and every member sees all content. Admins should be scoped to their own branch, while Pusat (headquarters) retains organization-wide oversight, and members should only see content relevant to their branch.

## What Changes
- Introduce a `branch` table (Pusat, DKI, Jateng, Lampung) with an `is_global` flag (Pusat = `true`).
- Map every user to a branch: `users.branch_id` is **required**.
- Add a **nullable** `branch_id` to `leagues`, `activities`, and `teams`; `null` means **national** content (visible to everyone). Sports stay global (unscoped).
- **Branch admins** manage only their own branch's leagues/activities/teams/users. **Pusat admins** (branch `is_global = true`) manage all branches and national content.
- **Members** see national content plus their own branch's content only. Pusat members get no special all-access (only Pusat *admins* do).
- New content created by a branch admin auto-assigns that admin's branch. Pusat admins choose the branch (including "National").
- Enforce branch ownership on single-record access (show/edit/update/destroy), not just list queries, to prevent cross-branch ID-guessing.
- Expose the current user's branch (and branch list for Pusat) via Inertia shared props.
- **Migration:** existing users backfill to Pusat; existing leagues/activities/teams stay `null` (national) so nothing disappears on launch.

## Impact
- Affected specs: `branch-scoping` (new), cross-references `admin-area`, `user-auth`, `leagues`, `sport-activities`, `team-management`, `leaderboards`.
- Affected code:
  - DB: `database/migrations/2026_05_29_000001_create_branch_table.php` (add `is_global`), new migrations for `branch_id` on users/leagues/activities/teams.
  - Models: new `Branch`, new `BelongsToBranch` trait; `User`, `League`, `Activity`, `Team`.
  - Auth: new `LeaguePolicy`/`ActivityPolicy`/`TeamPolicy`; `AppServiceProvider`.
  - Controllers: `app/Http/Controllers/Admin/{League,Activity,Team,User}Controller` (+ league sub-controllers); member-facing `LeagueController`, `ActivityController`, `TeamController`, `LeaderboardController`, `MatchController`.
  - Middleware: `HandleInertiaRequests`.
  - Frontend: `resources/js/Pages/Admin/{Users,Leagues,Activities,Teams}/*` create/edit/index pages and admin shell.
