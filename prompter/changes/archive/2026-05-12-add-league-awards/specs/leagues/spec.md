## ADDED Requirements
### Requirement: League Awards
The system SHALL allow leagues to store zero or more awards, where each award has a title and a winner label. Member-facing league detail screens SHALL display the awards section when awards exist.

#### Scenario: View awards for a completed league
- **WHEN** a user opens a league that has awards
- **THEN** the league detail page shows each award title and its winner label

#### Scenario: Hide awards when none exist
- **WHEN** a user opens a league that has no awards
- **THEN** the league detail page does not render an awards section

#### Scenario: Seeded basketball awards are visible
- **WHEN** the completed basketball tournament is seeded
- **THEN** its awards are persisted with the league
- **AND** the member-facing league detail page shows those awards
