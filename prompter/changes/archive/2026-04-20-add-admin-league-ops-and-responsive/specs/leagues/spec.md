## ADDED Requirements

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
