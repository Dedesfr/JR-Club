## MODIFIED Requirements

### Requirement: Update Live Score
The system SHALL allow admins to update the score of a live match in real-time. For badminton leagues, admins SHALL record per-set scores; the match completes automatically when a side reaches the league's configured `sets_to_win` sets won. For team-based leagues, admins SHALL increment integer scores. All score updates SHALL be broadcast to connected viewers via Laravel Reverb.

#### Scenario: Admin records a badminton set
- **WHEN** an admin submits a completed set with final points (e.g., 21–18) during a live badminton match
- **THEN** a `match_sets` row is persisted
- **AND** the updated set + overall set count is broadcast to all viewers

#### Scenario: Match auto-completes on sets-to-win
- **WHEN** a badminton player wins the configured `sets_to_win` number of sets
- **THEN** the match status changes to `completed`
- **AND** the winning entry advances per league stage (group points recompute or bracket progression)

#### Scenario: Admin updates team-based score
- **WHEN** an admin increments a team's score during a live team-based match
- **THEN** the score updates immediately for all viewers in real-time

#### Scenario: Non-admin cannot update score
- **WHEN** a member attempts to update a match score
- **THEN** the action is denied

### Requirement: End Match
The system SHALL allow admins to end a live match, finalizing the score and changing the status to "completed". For badminton matches that auto-complete on `sets_to_win`, the admin SHALL NOT need to manually end the match.

#### Scenario: Admin ends team-based match
- **WHEN** an admin ends a live team-based match
- **THEN** the match status changes to `completed`
- **AND** the final score is recorded
- **AND** league standings are recalculated

#### Scenario: Badminton match ends automatically
- **WHEN** the last set completes and one side has reached `sets_to_win`
- **THEN** the match status changes to `completed` without admin action
- **AND** group points or bracket advancement is updated accordingly
