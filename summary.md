# Conversation Summary

## Topic: Group Stage Round Count — 8 Rounds with Byes

### Problem
The client wanted 8 rounds for a league with 16 participants (2 groups × 8 players), but the system was generating 7 rounds.

### Discussion
- Standard round-robin for 8 players = **7 rounds** (each of the 28 unique pairs plays once, 4 matches per round).
- Client wanted **8 rounds** — meaning some weeks have 4 matches and some have 3 matches.
- This is **round-robin with byes**: each player sits out exactly 1 week, and all 28 unique pairs still play exactly once.
- Math: 4 rounds × 4 matches + 4 rounds × 3 matches = 28 total matches ✓

### Solution
Treat every group as if it has 1 extra dummy "bye" player. For 8 real players:
- Add dummy → 9 total (odd) → add another dummy → 10 total (even) ... actually: always add 1 dummy regardless of parity.
- For even n=8: 8 + 1 dummy = 9 → run round-robin for 9 → 9-1 = **8 rounds**, each with a bye match (skipped).
- Result: 8 rounds, each player sits out 1 round.

### Files Changed

**`resources/js/Components/DivisionPicker.tsx`**
- Changed round count formula from `group_size - 1` to `group_size`
- Now shows 8 date pickers for group_size=8 instead of 7

**`app/Services/LeagueFormatService.php`**
- Changed `generateGroupMatches()` to always add a dummy bye player (even for even group sizes)
- `$totalRounds` now equals `group_size` (was `group_size - 1`)
- Matches involving the dummy are skipped, producing the bye rounds

**`database/seeders/MensDoublesLeagueSeeder.php`**
- `end_date`: `addWeeks(4)` → `addWeeks(8)`

**`database/seeders/GroupStageMensDoublesLeagueSeeder.php`**
- `start_date`: `subWeeks(4)` → `subWeeks(8)`

**`database/seeders/CompletedMensDoublesLeagueSeeder.php`**
- `start_date`: `subWeeks(4)` → `subWeeks(8)`
