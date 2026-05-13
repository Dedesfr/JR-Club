## ADDED Requirements
### Requirement: Match Locking
The system SHALL allow admins to lock a match in the `live` or `completed` state to prevent further set additions or modifications, and SHALL allow admins to unlock a locked match to resume editing.

#### Scenario: Admin locks a completed match
- **WHEN** an admin requests to lock a match that is `live` or `completed`
- **THEN** the match `locked` flag is set to true
- **AND** any subsequent attempt to add, edit, or delete a set on that match is rejected

#### Scenario: Admin unlocks a locked match
- **WHEN** an admin unlocks a locked match
- **THEN** the match `locked` flag is set to false
- **AND** the admin can again add, edit, or delete sets

#### Scenario: Locking a scheduled match is not allowed
- **WHEN** an admin attempts to lock a match whose status is `scheduled`
- **THEN** the request is rejected and the lock state does not change

### Requirement: Admin Set Edit and Delete
The system SHALL allow admins to edit or delete an individual `MatchSet` on an unlocked match, and SHALL recompute the parent match's `home_score`, `away_score`, and `status` after any change.

#### Scenario: Admin edits a set's points
- **WHEN** an admin updates the home and away points of an existing set on an unlocked match
- **THEN** the set is updated
- **AND** the parent match's home/away set counts and status are recomputed
- **AND** a score-updated broadcast is emitted

#### Scenario: Admin deletes a set
- **WHEN** an admin deletes a set from an unlocked match
- **THEN** the set is removed
- **AND** the remaining sets are re-numbered contiguously starting at 1
- **AND** the parent match's home/away set counts and status are recomputed

#### Scenario: Set edit on a locked match is rejected
- **WHEN** an admin attempts to edit or delete a set on a locked match
- **THEN** the request is rejected and no changes are persisted
