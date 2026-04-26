## Context
JR Club badminton leagues currently model a two-step tournament: groups are generated first, then upper/lower brackets are seeded from group standings. The admin bracket controller depends on `LeagueFormatService::standings($league)`, so direct bracket tournaments cannot be created without first generating groups.

## Goals / Non-Goals
- Goals: let admins choose between group-start and bracket-start leagues, preserve current group-start behavior, and allow bracket-start tournaments to create bracket trees without groups.
- Non-Goals: automatic bracket slot assignment, changing scoring/progression, changing third-place behavior, or redesigning public league pages.

## Decisions
- Decision: Add `leagues.start_stage` with `group` as the default so existing leagues continue using the current workflow.
- Decision: Branch in `Admin\LeagueBracketController@store`; group-start leagues continue using standings, while bracket-start leagues use registered `league_entries` as the bracket candidate pool.
- Decision: Keep bracket slots manual by relying on the existing `BracketService::seedBrackets()` behavior, which creates match trees without assigning entries.
- Decision: Use the existing Bracket tab and schedule form for both modes, avoiding a new route or separate bracket-start page.

## Risks / Trade-offs
- Risk: `advance_upper_count` currently means entries advancing per group, but bracket-start leagues have no groups. Mitigation: bracket-start seeding uses all registered entries for the upper bracket initially, while retaining the existing fields for compatibility and future lower-bracket expansion.
- Risk: Reseeding brackets after third-place matches exist can leave stale foreign keys. Mitigation: clear third-place references before deleting/recreating bracket matches.
- Risk: Existing specs state brackets are seeded from group-stage results. Mitigation: modify the requirements to distinguish group-start and bracket-start behavior.

## Migration Plan
Add the nullable/defaulted `start_stage` column with default `group`. Existing records require no manual migration because current behavior is group-start.

## Open Questions
- None. User selected manual bracket slots for bracket-start leagues.
