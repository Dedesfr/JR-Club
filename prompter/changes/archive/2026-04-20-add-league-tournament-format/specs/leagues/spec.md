## MODIFIED Requirements

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

## ADDED Requirements

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
The system SHALL allow admins to seed both an upper and a lower single-elimination bracket from group-stage results, configuring `advance_upper_count` and `advance_lower_count` per league. Each bracket runs as independent single elimination and produces its own champion.

#### Scenario: Seed brackets with top-1 upper, top-2 lower
- **WHEN** an admin configures `advance_upper_count = 1` and `advance_lower_count = 1`
- **AND** clicks "Seed brackets" for a 4-group league
- **THEN** an upper bracket with 4 entries and a lower bracket with 4 entries are created, each as single-elimination trees

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
