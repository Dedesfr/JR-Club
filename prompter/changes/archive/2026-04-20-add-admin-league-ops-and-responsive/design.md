## Context
The admin tournament flow landed in the archived `add-league-tournament-format` change. Real-world usage uncovered gaps: schedules are tied to the league start date with no per-round control, brackets are auto-seeded with no manual override, matches lack player info/photos/substitution tracking, and participants must be added one-by-one. Separately, the PWA is `max-w-md` everywhere — admins on desktops see a mobile-sized column.

## Goals / Non-Goals
- Goals:
  - Admins can manually re-seed brackets, schedule groups, substitute players, attach match photos, import participants from xlsx, and run a third-place match.
  - Members and admins get a coherent responsive layout (mobile / tablet / desktop).
  - Zero breakage for leagues that have already started scoring.
- Non-Goals:
  - Email/push notifications for substitutions.
  - Video or PDF match documentation.
  - Cross-league participant registries or shared rosters.
  - i18n of admin copy.

## Decisions

### D1 — Photo storage on local `public` disk
**Decision:** store match photos on Laravel's `public` disk under `matches/{match_id}/`, link via `php artisan storage:link`.
**Why:** internal app with < 1k users on a single VPS; avoids new infra and credentials.
**Alternatives:** S3-compatible bucket (overkill; no existing cloud creds); no storage (user asked for photos).

### D2 — `maatwebsite/excel` for xlsx import/export
**Decision:** add `maatwebsite/excel`; implement `LeagueParticipantsImport implements ToModel, WithHeadingRow, WithValidation` and `LeagueParticipantsExport implements FromCollection, WithHeadings`.
**Why:** standard Laravel xlsx library; handles templates, validation, chunking.
**Alternatives:** CSV-only (weaker UX); openspout/openspout (less Laravel-integrated).

### D3 — New `match_substitutions` table, not a column mutation
**Decision:** preserve history by recording each substitution as a row (`match_id`, `entry_id`, `original_player_id`, `substitute_id`, `reason`, `activated_at`).
**Why:** an entry may substitute different players on different matches; overwriting player columns would lose history and make set-level scoring ambiguous.
**Alternatives:** mutate `league_entries.player*_id` (destructive); add nullable columns to `matches` (conflates entry-level roster with match-level activation).

### D4 — `BracketService::swapSlots` rejects scored matches
**Decision:** the swap endpoint validates both matches have zero `match_sets` rows and no final score; otherwise returns a 422.
**Why:** post-scoring swaps would corrupt standings and advancement.

### D5 — Third-place match as a dedicated `matches` row
**Decision:** add `leagues.third_place_match_id` (nullable FK to `matches`). The row uses `stage='upper'`, `bracket_slot='third_place'`, and is populated by `BracketService::advanceWinner` when upper-bracket semifinals finalize.
**Why:** reuses existing match/scoring infra, visible in `BracketTree` without schema changes.
**Alternatives:** separate `third_place_matches` table (needless).

### D6 — Responsive: breakpoint-aware layout components, not a CSS rewrite
**Decision:** keep mobile Tailwind classes as the default (smallest breakpoint) and add `md:` / `lg:` overrides. Layouts get a `useBreakpoint` hook or CSS-only variants (preferred: CSS-only).
**Why:** minimizes risk to the already-shipped mobile UI; changes are additive.

### D7 — Group schedule is additive
**Decision:** `LeagueGroupController@generateMatches` accepts an optional `schedule[]` array. When omitted, fall back to league start date + (round_index × 1 day).
**Why:** backwards compatible with existing admin UI and tests.

## Risks / Trade-offs
- **Storage growth** from photos → cap at 10 files × 5 MB per match; add a TODO to audit in v2.
- **Substitution audit** tied to `activated_at` only → good enough for current "who played" reports; can add a `deactivated_at` later if rotations become common.
- **Responsive regressions** on legacy mobile views → smoke test at 375 px for every route before merging.
- **Import race conditions**: importing the same email twice in one file → validation layer de-dupes and reports a per-row error.

## Migration Plan
1. Ship schema + dependency changes (Phase 1) behind a feature branch.
2. Deploy backend + admin UI (Phases 2–4) together; no data backfill needed (all new columns/tables additive).
3. Deploy responsive redesign (Phase 5) last to isolate regressions.
4. Rollback: migrations are reversible (`down()` drops new tables and columns). `composer remove maatwebsite/excel` if needed.

## Open Questions
- None — scope confirmed with stakeholders in planning.
