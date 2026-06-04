## ADDED Requirements
### Requirement: Deuce Set Validation
For leagues whose `match_format` enables a deuce rule (Tenis Meja), the system SHALL validate each recorded or edited set so that the winning side reaches at least the format's target points and, when both sides are within one point of the target, wins by a margin of two.

#### Scenario: Valid set without deuce
- **WHEN** an admin records a Tenis Meja set of 11–9
- **THEN** the set is accepted and persisted

#### Scenario: Reject set won by one at deuce
- **WHEN** an admin records a Tenis Meja set of 11–10
- **THEN** the request is rejected with a validation error
- **AND** no set is persisted

#### Scenario: Valid set won by two at deuce
- **WHEN** an admin records a Tenis Meja set of 12–10
- **THEN** the set is accepted and persisted

### Requirement: Match Completion Modes
The system SHALL determine a match's completion using the completion mode of the league's `match_format`: `first_to_win` completes when one side reaches `sets_to_win` sets; `all_sets` completes only when all configured sets have been recorded, with the winner being the side that won more sets; `single_block` completes when one block scored to the target points is recorded, with the higher score winning. A league with no `match_format` SHALL use `first_to_win`.

#### Scenario: First-to-win completion
- **WHEN** a Tenis Meja Best of Five match reaches 3 sets won by one side
- **THEN** the match status changes to `completed`

#### Scenario: All-sets completion stays live until full
- **WHEN** a Padel Best of Five match has recorded 3 of 5 sets with one side leading 3–0
- **THEN** the match status remains `live`
- **AND** the match completes only after all 5 sets are recorded, with the side winning more sets as the winner

#### Scenario: Single-block completion
- **WHEN** an admin records a Padel Americano block scored to 21
- **THEN** the match status changes to `completed`
- **AND** the side with the higher score is the winner

#### Scenario: Reject sets beyond the format limit
- **WHEN** an admin attempts to record a set beyond the configured number of sets for an `all_sets` or `single_block` format
- **THEN** the request is rejected with a validation error
