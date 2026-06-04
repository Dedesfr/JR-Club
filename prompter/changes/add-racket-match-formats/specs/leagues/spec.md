## ADDED Requirements
### Requirement: Match Format Selection
The system SHALL allow admins to assign an optional `match_format` to a league that determines its set target, deuce rule, and match-completion semantics. Supported formats are Padel (`semi_klasik`, `best_of_three`, `best_of_five`, `americano`) and Tenis Meja (`best_of_five`, `best_of_seven`). Selecting a format SHALL prefill the league's `sets_to_win` and `points_per_set`, both of which remain editable. A league with a null `match_format` SHALL retain the existing first-to-`sets_to_win` behavior.

#### Scenario: Admin selects a match format
- **WHEN** an admin creates or edits a league and selects a `match_format`
- **THEN** the league persists the `match_format`
- **AND** `sets_to_win` and `points_per_set` are prefilled from the format's defaults

#### Scenario: Admin overrides prefilled values
- **WHEN** an admin changes `sets_to_win` or `points_per_set` after selecting a format
- **THEN** the edited values are saved on the league

#### Scenario: League without a match format
- **WHEN** a league has no `match_format` set
- **THEN** match completion follows the existing first-to-`sets_to_win` behavior
