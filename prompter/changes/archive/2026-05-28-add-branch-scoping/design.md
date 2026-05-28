## Context
The app guards all admin actions with a single `admin` Gate (`AppServiceProvider.php:24`) and runs every admin/member query unscoped. We need a second, orthogonal dimension — *branch* — layered on top of the existing `member`/`admin` role, without breaking auth, login, notifications, or the substitute relations that depend on `User`.

Branches are organizational units of Jasa Raharja. Pusat is headquarters and supervises all branches.

## Goals / Non-Goals
- Goals:
  - Branch admins manage only their branch; Pusat admins manage everything.
  - Members see national + own-branch content; no cross-branch leakage (incl. via guessed IDs).
  - National (shared) content remains possible via nullable `branch_id`.
  - Minimal, reusable scoping primitives over copy-pasted query filters.
- Non-Goals:
  - Scoping Sports (remain global config).
  - Branch-level role hierarchy beyond `member`/`admin`.
  - Giving Pusat *members* all-branch visibility.

## Decisions
- **Headquarters via `branch.is_global` flag**, not a hardcoded `"Pusat"` string match. Renaming/adding global branches needs no code change. `User::isPusatAdmin()` = `isAdmin() && branch?->is_global`.
- **`BelongsToBranch` trait** on `League`, `Activity`, `Team` providing:
  - `branch()` belongsTo relation.
  - a `creating` model hook that sets `branch_id` from the authenticated branch admin when not explicitly provided (Pusat admins/seeders may set it, including `null` for national).
  - `scopeVisibleTo($q, $user)` → `branch_id IS NULL OR branch_id = $user->branch_id` (member-facing rule; applies even to Pusat members).
  - `scopeManageableBy($q, $user)` → Pusat admin: no filter; branch admin: `branch_id = $user->branch_id` (national/other-branch content is Pusat-managed only).
- **Per-entity Policies** (`view`/`update`/`delete`) close the single-record / ID-guessing hole that list-only filtering leaves open. `Gate::before` short-circuits Pusat admins. Admin single-record controller methods call `$this->authorize(...)`.
- **No global scope on `User`.** A global Eloquent scope on `User` would poison `auth()->user()`, login lookups, notification routing, and substitute relations. The admin *user list* is scoped explicitly instead; everywhere else `User` stays unscoped.
- **Match & leaderboard visibility derive from the parent league's branch** rather than carrying their own `branch_id`.

## Risks / Trade-offs
- Forgetting a branch check on a single-record route → cross-branch data leak. Mitigation: Policies applied uniformly; feature tests assert 403/404 for foreign-branch access.
- Accidental global scope / relation poisoning on `User`. Mitigation: explicit list scoping only; documented non-goal.
- Day-one empty app for non-Pusat members. Mitigation: existing content stays `null` (national) so it remains visible to all until branches are assigned.

## Migration Plan
1. Add `is_global` to `branch`; set Pusat row `true`.
2. Add `users.branch_id` (not null) with backfill: all existing users → Pusat branch id.
3. Add nullable `branch_id` to `leagues`, `activities`, `teams`; leave existing rows `null` (national).
4. Rollback: drop the added columns; `branch` table drop handled by its own migration `down()`.

## Open Questions
- None blocking. Future: a per-admin branch *filter* UI for Pusat (deferred, not required for correctness).
