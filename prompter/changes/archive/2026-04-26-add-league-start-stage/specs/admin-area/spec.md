## MODIFIED Requirements
### Requirement: Admin League Management
The admin area SHALL provide dedicated league management screens including list, create, and detail views. The create and detail views SHALL allow admins to choose and view whether a badminton league starts from group stage or bracket stage. The detail view SHALL expose tabs for Overview, Participants, Groups, Bracket, and Matches, each backed by admin-only endpoints, with group-only controls disabled or replaced by explanatory guidance for bracket-start leagues.

#### Scenario: Create a badminton league
- **WHEN** an admin submits the "New League" form with category, participant total, sets-to-win, points-per-set, and start stage
- **THEN** the league is created with `stage = setup`
- **AND** the selected `start_stage` is persisted

#### Scenario: Assign entries from Participants tab
- **WHEN** an admin assigns entries matching the league's category gender rules
- **THEN** the entries appear in the participants list

#### Scenario: Generate groups from Groups tab
- **WHEN** an admin selects a valid division (e.g., 4 groups of 4) for a group-start league and clicks "Generate groups"
- **THEN** groups and their round-robin matches are created and the league transitions to `stage = group`

#### Scenario: Open Groups tab for bracket-start league
- **WHEN** an admin opens the Groups tab for a league with `start_stage = bracket`
- **THEN** the admin is informed that group generation is skipped for this league
- **AND** group generation controls are not presented as a required step

#### Scenario: Seed and progress brackets from Bracket tab
- **WHEN** an admin seeds upper and lower brackets for a group-start league after the group stage or seeds a bracket-start league after participants are registered
- **THEN** bracket trees are created and the league transitions to `stage = upper`
- **AND** a visual `BracketTree` renders both brackets for admin editing
