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

### Requirement: View Live Match
The system SHALL display live match details including team names, current score, and match status. The view SHALL update in real-time without page refresh.

#### Scenario: Real-time score viewing
- **WHEN** a user opens a live match page
- **THEN** the current score is displayed
- **AND** score changes appear in real-time

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

### Requirement: Match Player Substitution
The system SHALL let admins activate a declared substitute on a specific match, preserving the original player in the entry roster and recording an auditable substitution row.

#### Scenario: Activate declared substitute
- **WHEN** an admin submits a substitution for a match specifying the entry, the original player, and a substitute drawn from that entry's declared substitutes
- **THEN** a `match_substitutions` row is created with `activated_at` set to the current time
- **AND** subsequent match views show the substitute as the active player for that entry

#### Scenario: Reject undeclared substitute
- **WHEN** an admin submits a substitution whose substitute is not among the entry's declared substitutes
- **THEN** the request is rejected with a validation error
- **AND** no substitution row is created

### Requirement: Match Documentation Uploads
The system SHALL let admins attach image files (JPEG, PNG, WEBP) as documentation to any match, store them on the `public` disk, and expose them on the match view.

#### Scenario: Upload a valid photo
- **WHEN** an admin uploads a JPEG image under 5 MB to a match
- **THEN** the file is saved under `matches/{match_id}/` on the `public` disk
- **AND** a `match_documents` row records its path, original name, and uploader

#### Scenario: Reject oversize file
- **WHEN** an admin uploads a file larger than 5 MB or with a disallowed mime type
- **THEN** the upload is rejected with a validation error
- **AND** no file is stored on disk and no row is created

#### Scenario: Delete a photo
- **WHEN** an admin deletes a match document
- **THEN** the `match_documents` row is removed
- **AND** the file is deleted from the `public` disk

