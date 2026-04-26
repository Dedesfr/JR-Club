# leagues Specification

## Purpose
TBD - created by archiving change add-jrclub-mvp. Update Purpose after archive.
## Requirements
### Requirement: Create League
The system SHALL allow admins to create leagues specifying name, sport type, description, start date, and end date.

#### Scenario: Admin creates league
- **WHEN** an admin submits a valid league form
- **THEN** a new league is created with status "upcoming"

### Requirement: Register Teams to League
The system SHALL support two registration modes per league, determined by its `category`:
- **Team-based leagues** (no badminton category set): admins register teams of the matching sport type.
- **Badminton leagues** (category ∈ {MS, WS, MD, WD, XD}): admins assign `league_entries` directly; teams are not used. Members MUST NOT be able to self-register in either mode.

#### Scenario: Register eligible team
- **WHEN** an admin registers a team whose sport type matches a non-badminton league
- **THEN** the team is added to the league

#### Scenario: Reject mismatched sport
- **WHEN** an admin attempts to register a team with a different sport type
- **THEN** registration is rejected

#### Scenario: Member cannot self-register
- **WHEN** a non-admin attempts to join a league (team-based or badminton)
- **THEN** the action is denied

### Requirement: League Schedule
The system SHALL allow admins to schedule matches between registered teams within a league.

#### Scenario: Schedule match
- **WHEN** an admin creates a match between two registered teams with a date/time
- **THEN** the match appears in the league schedule

### Requirement: League Standings
The system SHALL compute and display standings for each league based on match results.
- **Team-based leagues**: standings include played, won, drawn, lost, goals for, goals against, goal difference, and points (3 for win, 1 for draw, 0 for loss).
- **Badminton leagues**: group-stage standings include matches played, wins, and points (+1 per win). Ties are broken by admin-set `manual_advance_rank` before bracket seeding.

#### Scenario: View team-based standings
- **WHEN** a user views a team-based league's standings
- **THEN** teams are ranked by points, then goal difference, then goals for

#### Scenario: View badminton group standings
- **WHEN** a user views a badminton league's group
- **THEN** entries within the group are ranked by wins (points), then by `manual_advance_rank` when present

#### Scenario: Standings update after match
- **WHEN** a match is completed with a final score
- **THEN** the standings are recalculated automatically

### Requirement: League Status Management
The system SHALL support league statuses: upcoming, active, and completed. Admins SHALL manage status transitions.

#### Scenario: Activate league
- **WHEN** an admin activates a league
- **THEN** the status changes to "active" and matches can begin

### Requirement: Badminton League Category
The system SHALL allow admins to create badminton leagues specifying a `category` of Men's Singles (MS), Women's Singles (WS), Men's Doubles (MD), Women's Doubles (WD), or Mixed Doubles (XD). The category determines `entry_type` (single or double) and gender rules for entries.

#### Scenario: Create MS league
- **WHEN** an admin creates a league with category MS
- **THEN** `entry_type` is set to `single` and only male users may be assigned as entries

#### Scenario: Create XD league
- **WHEN** an admin creates a league with category XD
- **THEN** `entry_type` is set to `double` and each entry MUST have exactly one male and one female player

### Requirement: League Entry Assignment
The system SHALL allow admins to assign entries to a badminton league. An entry consists of `player1_id` (required), `player2_id` (required for doubles, null for singles), and an optional `substitute_id`. Gender rules per category MUST be enforced.

#### Scenario: Assign singles entry
- **WHEN** an admin assigns a player to a singles league
- **THEN** an entry is created with that player and no partner

#### Scenario: Assign doubles entry with substitute
- **WHEN** an admin assigns two players and a substitute to a doubles league
- **THEN** an entry is created with all three slots filled and gender rules satisfied for each slot

#### Scenario: Reject gender-invalid entry
- **WHEN** an admin attempts to assign a female player to an MS entry
- **THEN** the assignment is rejected

### Requirement: Group Stage Generation
The system SHALL allow admins to configure a badminton league's participant total and divide entries into groups. The system SHALL offer only division options where `participant_total` is evenly divisible by `group_count` and each group has at least 2 entries. Upon group creation the system SHALL auto-generate a full round-robin match schedule per group.

#### Scenario: Valid division options for 16 participants
- **WHEN** an admin views division options for `participant_total = 16`
- **THEN** options include 2 groups of 8, 4 groups of 4, and 8 groups of 2

#### Scenario: Generate round-robin per group
- **WHEN** an admin creates 4 groups of 4 entries
- **THEN** 6 round-robin matches are generated per group (24 total) with `stage = group`

### Requirement: Group Point Scoring and Tiebreak
The system SHALL award +1 point to the winner of every completed group-stage match. When entries finish the group stage with equal points, admins SHALL set `manual_advance_rank` on tied entries to determine advancement order.

#### Scenario: Point awarded on group match completion
- **WHEN** a group-stage match is completed
- **THEN** the winning entry's points in that group increase by 1

#### Scenario: Admin resolves tie
- **WHEN** two entries finish a group with equal points
- **AND** an admin sets `manual_advance_rank` values on each
- **THEN** advancement order uses those ranks

### Requirement: Upper and Lower Bracket Seeding
The system SHALL allow admins to seed single-elimination brackets according to the league start stage. For `start_stage = group`, admins SHALL seed upper and lower brackets from group-stage results by configuring `advance_upper_count` and `advance_lower_count` per league. For `start_stage = bracket`, admins SHALL seed bracket trees directly from registered league entries without requiring groups, and initial bracket match slots SHALL remain empty for manual assignment. Each bracket runs as independent single elimination and produces its own champion.

#### Scenario: Seed brackets with top-1 upper, top-2 lower
- **WHEN** an admin configures `advance_upper_count = 1` and `advance_lower_count = 1` for a 4-group league with `start_stage = group`
- **AND** clicks "Seed brackets"
- **THEN** an upper bracket with 4 entries and a lower bracket with 4 entries are created, each as single-elimination trees

#### Scenario: Seed bracket-start league directly
- **WHEN** an admin registers entries for a league with `start_stage = bracket`
- **AND** clicks "Seed brackets"
- **THEN** bracket matches are created without requiring league groups or group standings
- **AND** the initial bracket slots are empty until an admin manually assigns entries

#### Scenario: Non-power-of-2 bracket size
- **WHEN** the upper bracket is seeded with 5 entries
- **THEN** the top seed receives a first-round bye and the remaining 4 entries play into round 2

### Requirement: Bracket Progression
The system SHALL advance the winner of each bracket match into the next round's slot. When a bracket's final match completes, the winner becomes that bracket's champion.

#### Scenario: Winner advances
- **WHEN** a bracket match is completed
- **THEN** the winning entry is written to the `next_match_id` slot

#### Scenario: Crown upper and lower champions
- **WHEN** both the upper-bracket final and lower-bracket final are completed
- **THEN** the league displays two champions (upper and lower) and `league.stage` becomes `completed`

### Requirement: Manual Bracket Shuffle
The system SHALL allow admins to swap two entries between unscored bracket slots in either the upper or lower tree of a league.

#### Scenario: Swap two unscored slots
- **WHEN** an admin submits a swap request naming two matches and sides that have no recorded sets
- **THEN** the two bracket slots exchange their `home_entry_id` or `away_entry_id` values
- **AND** a success response is returned

#### Scenario: Reject swap when scored
- **WHEN** an admin submits a swap request and either involved match already has a recorded set or final score
- **THEN** the request is rejected with a validation error
- **AND** no entry fields are modified

### Requirement: Group Match Scheduling
The system SHALL accept per-round scheduled date/time values when an admin generates group-stage matches, and write them to each produced match's `scheduled_at` column.

#### Scenario: Generate with explicit schedule
- **WHEN** an admin generates group matches and supplies a schedule array mapping round to a date/time
- **THEN** every produced match for round N has `scheduled_at` equal to the supplied value

#### Scenario: Generate without schedule uses default
- **WHEN** an admin generates group matches without supplying a schedule
- **THEN** round N matches have `scheduled_at` equal to the league's start date plus N days

### Requirement: Third-Place Match
Single-elimination league brackets with semifinals SHALL include a third-place match populated from the two upper-bracket semifinal losers, with its reference stored on `leagues.third_place_match_id`.

#### Scenario: Third-place generated with brackets
- **WHEN** an admin seeds a bracket whose upper tree has semifinals
- **THEN** a matches row is created with `stage='upper'` and `bracket_slot='third_place'`
- **AND** `leagues.third_place_match_id` references that row

#### Scenario: Third-place populated after semifinals
- **WHEN** both upper-bracket semifinals are finalized
- **THEN** the third-place match's `home_entry_id` and `away_entry_id` are set to the losing entries

### Requirement: Participant Excel Import and Export
The system SHALL let admins download an xlsx template, import participants from an xlsx file, and export current participants to xlsx.

#### Scenario: Download template
- **WHEN** an admin requests the participants template
- **THEN** an xlsx download is streamed containing the header row `player1_email, player2_email, substitute_emails, group_name`

#### Scenario: Import with a mix of valid and invalid rows
- **WHEN** an admin uploads an xlsx file where some rows fail category or email validation
- **THEN** valid rows are persisted as `league_entries`
- **AND** invalid rows are reported back with row numbers and field-level errors
- **AND** the import does not halt after the first invalid row

#### Scenario: Export current participants
- **WHEN** an admin requests an export for a league with entries
- **THEN** an xlsx download is streamed listing every participant with player emails, substitutes, and group assignment

### Requirement: Configurable Tournament Start Stage
The system SHALL allow admins to choose whether a badminton league starts from group stage or bracket stage. Existing and newly created leagues without an explicit choice SHALL default to `start_stage = group`.

#### Scenario: Create group-start league by default
- **WHEN** an admin creates a badminton league without changing the start-stage choice
- **THEN** the league is stored with `start_stage = group`
- **AND** the current group generation workflow remains available

#### Scenario: Create bracket-start league
- **WHEN** an admin creates a badminton league with start stage set to bracket
- **THEN** the league is stored with `start_stage = bracket`
- **AND** group generation is not required before bracket seeding

