## ADDED Requirements

### Requirement: Create League
The system SHALL allow admins to create leagues specifying name, sport type, description, start date, and end date.

#### Scenario: Admin creates league
- **WHEN** an admin submits a valid league form
- **THEN** a new league is created with status "upcoming"

### Requirement: Register Teams to League
The system SHALL allow admins to register teams to a league. Only teams of the matching sport type SHALL be eligible.

#### Scenario: Register eligible team
- **WHEN** an admin registers a team whose sport type matches the league
- **THEN** the team is added to the league

#### Scenario: Reject mismatched sport
- **WHEN** an admin attempts to register a team with a different sport type
- **THEN** registration is rejected

### Requirement: League Schedule
The system SHALL allow admins to schedule matches between registered teams within a league.

#### Scenario: Schedule match
- **WHEN** an admin creates a match between two registered teams with a date/time
- **THEN** the match appears in the league schedule

### Requirement: League Standings
The system SHALL compute and display standings for each league based on match results. Standings SHALL include: played, won, drawn, lost, goals for, goals against, goal difference, and points (3 for win, 1 for draw, 0 for loss).

#### Scenario: View standings
- **WHEN** a user views a league's standings
- **THEN** teams are ranked by points, then goal difference, then goals for

#### Scenario: Standings update after match
- **WHEN** a match is completed with a final score
- **THEN** the standings are recalculated automatically

### Requirement: League Status Management
The system SHALL support league statuses: upcoming, active, and completed. Admins SHALL manage status transitions.

#### Scenario: Activate league
- **WHEN** an admin activates a league
- **THEN** the status changes to "active" and matches can begin
