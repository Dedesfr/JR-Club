# Change: Add configurable league start stage

## Why
Badminton leagues currently assume every tournament starts with group play before brackets. Admins need to run some leagues as direct bracket tournaments while keeping the current group-to-bracket flow available.

## What Changes
- Add a persisted league `start_stage` option so admins can choose `group` or `bracket` during league setup.
- Keep group-start leagues on the existing Groups -> Bracket workflow.
- Allow bracket-start leagues to seed bracket trees directly from registered league entries, leaving match slots empty for manual assignment.
- Adjust admin league screens so group-only controls are not presented as the required path for bracket-start leagues.

## Impact
- Affected specs: `leagues`, `admin-area`
- Affected code: `leagues` schema/model, admin league create/detail pages, `Admin\LeagueController`, `Admin\LeagueBracketController`, `BracketService`, tournament flow tests
