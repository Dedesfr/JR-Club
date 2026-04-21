# admin-area Specification

## Purpose
TBD - created by archiving change add-league-tournament-format. Update Purpose after archive.
## Requirements
### Requirement: Admin Shell
The system SHALL provide an authenticated admin area mounted at `/admin`, accessible only to users with `users.role = 'admin'`. The admin shell SHALL render a persistent sidebar (Dashboard, Leagues, Sports, Activities, Users, Teams, return-to-app link) and a top bar showing the current admin.

#### Scenario: Admin accesses /admin
- **WHEN** a user with admin role navigates to `/admin`
- **THEN** the admin shell is rendered with sidebar navigation

#### Scenario: Non-admin is denied
- **WHEN** a member navigates to `/admin`
- **THEN** the request is rejected by the `admin` Gate

### Requirement: Admin Dashboard
The system SHALL display an admin dashboard summarising counts of active leagues, registered entries, upcoming matches, and live matches.

#### Scenario: Dashboard KPIs
- **WHEN** an admin opens `/admin`
- **THEN** dashboard cards display current counts sourced from the database

### Requirement: Admin League Management
The admin area SHALL provide dedicated league management screens including list, create, and detail views. The detail view SHALL expose tabs for Overview, Participants, Groups, Bracket, and Matches, each backed by admin-only endpoints.

#### Scenario: Create a badminton league
- **WHEN** an admin submits the "New League" form with category, participant total, sets-to-win, and points-per-set
- **THEN** the league is created with `stage = setup`

#### Scenario: Assign entries from Participants tab
- **WHEN** an admin assigns entries matching the league's category gender rules
- **THEN** the entries appear in the participants list

#### Scenario: Generate groups from Groups tab
- **WHEN** an admin selects a valid division (e.g., 4 groups of 4) and clicks "Generate groups"
- **THEN** groups and their round-robin matches are created and the league transitions to `stage = group`

#### Scenario: Seed and progress brackets from Bracket tab
- **WHEN** an admin seeds upper and lower brackets after the group stage
- **THEN** bracket trees are created and the league transitions to `stage = upper`
- **AND** a visual `BracketTree` renders both brackets for admin editing

### Requirement: Admin Stub Modules
The admin area SHALL include list and basic edit screens for Sports, Activities, Users, and Teams. Deep CRUD (bulk actions, advanced filters) is out of scope for this increment but the routes and layouts SHALL exist so future increments can extend them without restructuring navigation.

#### Scenario: Admin opens Users list
- **WHEN** an admin navigates to `/admin/users`
- **THEN** a paginated list of users is displayed with edit links for basic fields (name, email, role, gender)

