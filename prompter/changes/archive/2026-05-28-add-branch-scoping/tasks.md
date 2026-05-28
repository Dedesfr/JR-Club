## 1. Database & Models
- [x] 1.1 Edit `database/migrations/2026_05_29_000001_create_branch_table.php` — add `is_global` boolean (default false); set the Pusat row to `is_global = true`.
- [x] 1.2 New migration `add_branch_id_to_users_table` — `branch_id` foreign key (not null), backfilling existing users to the Pusat branch id.
- [x] 1.3 New migration `add_branch_id_to_content_tables` — nullable `branch_id` foreign key on `leagues`, `activities`, `teams` (existing rows remain null = national).
- [x] 1.4 New `app/Models/Branch.php` — `name`, `is_global` fillable; hasMany users/leagues/activities/teams.
- [x] 1.5 New trait `app/Models/Concerns/BelongsToBranch.php` — `branch()` relation; `creating` hook auto-assigns branch from the authenticated branch admin when not set; `scopeVisibleTo($q, $user)` and `scopeManageableBy($q, $user)`.
- [x] 1.6 Apply `BelongsToBranch` to `League`, `Activity`, `Team`; add `branch_id` to each `$fillable`.
- [x] 1.7 `User` model — add `branch()` belongsTo and `branch_id` to `$fillable`; add `isPusatAdmin()` helper. Do NOT add a global scope to `User`.

## 2. Authorization & Backend
- [x] 2.1 New `LeaguePolicy`, `ActivityPolicy`, `TeamPolicy` (`view`/`update`/`delete`) allowing Pusat admins (via `Gate::before`) or matching `branch_id`; register in `AppServiceProvider`.
- [x] 2.2 Admin single-record methods in `Admin/LeagueController`, `Admin/ActivityController`, `Admin/TeamController` (and league sub-controllers: Entry/Group/Bracket/Match) — add `$this->authorize(...)` to block cross-branch id access.
- [x] 2.3 Admin index queries — apply `->manageableBy($user)` in `Admin/{League,Activity,Team}Controller::index`.
- [x] 2.4 `Admin/UserController` — scope `index` to the admin's branch (Pusat = all); add `branch_id` validation (`exists:branch,id`) to `store`/`update`; pass branch list to Create/Edit.
- [x] 2.5 Admin create/store for league/activity/team — add `branch_id` validation (`nullable, exists:branch,id`); rely on trait auto-assignment for branch admins; pass `branches` to create pages for Pusat admins.
- [x] 2.6 Member-facing controllers — apply `->visibleTo($user)` in `LeagueController`, `ActivityController`, `TeamController` (index + abort-unless on show), `LeaderboardController`, and `MatchController::show` (derive from parent league branch).
- [x] 2.7 `HandleInertiaRequests::share` — eager-load `auth.user.branch`; expose `isPusatAdmin` and (for Pusat) the branch list.

## 3. Frontend (Inertia/React)
- [x] 3.1 `Admin/Users/Create` and `Edit` — add required Branch `<select>`.
- [x] 3.2 `Admin/Leagues/Create`, `Admin/Activities/Create`, `Admin/Teams/Create` — Branch select (incl. "National") shown only to Pusat admins; auto/hidden for branch admins.
- [x] 3.3 Admin index pages (`Admin/{Users,Leagues,Activities,Teams}/Index`) — show a Branch column/badge.
- [x] 3.4 Admin shell (sidebar/header) — display the current admin's branch.

## 4. Tests & Validation
- [x] 4.1 Feature test — branch admin index is scoped; show/update/destroy on a foreign-branch record returns 403.
- [x] 4.2 Feature test — Pusat admin sees and manages all branches and national content.
- [x] 4.3 Feature test — creating content as a branch admin auto-assigns their branch.
- [x] 4.4 Feature test — member sees national + own-branch content only; foreign-branch detail returns 404; Pusat member gets no all-access.
- [x] 4.5 Feature test — login/auth and a `User` relation lookup work unchanged under branch scoping.

## Post-Implementation
- [x] Update `AGENTS.md` / `prompter/project.md` to document the branch role dimension and `branch.is_global` convention.
