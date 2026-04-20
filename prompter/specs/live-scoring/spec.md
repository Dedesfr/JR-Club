# live-scoring Specification

## Purpose
TBD - created by archiving change add-jrclub-mvp. Update Purpose after archive.
## Requirements
### Requirement: Start Live Match
The system SHALL allow admins to start a scheduled match, changing its status to "live".

#### Scenario: Start match
- **WHEN** an admin starts a scheduled match
- **THEN** the match status changes to "live"
- **AND** real-time score tracking begins

### Requirement: Update Live Score
The system SHALL allow admins to update the score of a live match in real-time. Score updates SHALL be pushed to all connected viewers via Convex subscriptions.

#### Scenario: Admin updates score
- **WHEN** an admin increments a team's score during a live match
- **THEN** the score updates immediately for all viewers in real-time

#### Scenario: Non-admin cannot update score
- **WHEN** a member attempts to update a match score
- **THEN** the action is denied

### Requirement: View Live Match
The system SHALL display live match details including team names, current score, and match status. The view SHALL update in real-time without page refresh.

#### Scenario: Real-time score viewing
- **WHEN** a user opens a live match page
- **THEN** the current score is displayed
- **AND** score changes appear in real-time

### Requirement: End Match
The system SHALL allow admins to end a live match, finalizing the score and changing the status to "completed".

#### Scenario: End match
- **WHEN** an admin ends a live match
- **THEN** the match status changes to "completed"
- **AND** the final score is recorded
- **AND** league standings are recalculated

