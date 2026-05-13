# Change: Add league awards

## Why
Completed leagues can have meaningful individual recognitions such as man of the match or skills contest winners, but the app currently has no way to store or display them. The finished basketball tournament data already includes awards, so this information should be modeled and surfaced instead of being left in source notes.

## What Changes
- Add league-level awards storage linked to a league
- Display awards on member-facing league detail screens when present
- Seed basketball tournament awards from `basketball-done.md`

## Impact
- Affected specs: `leagues`
- Affected code: league schema/models, league controllers, member league UI, basketball completed seeder
