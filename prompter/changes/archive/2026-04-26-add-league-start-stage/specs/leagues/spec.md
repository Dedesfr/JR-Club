## ADDED Requirements
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

## MODIFIED Requirements
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
