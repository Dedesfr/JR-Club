## ADDED Requirements

### Requirement: Branch Registry
The system SHALL maintain a registry of branches, each with a name and an `is_global` flag that designates headquarters-level (organization-wide) access.

#### Scenario: Seeded branches
- **WHEN** the database is migrated and seeded
- **THEN** the `branch` table contains Pusat, DKI, Jateng, and Lampung
- **AND** the Pusat branch has `is_global = true` and all others have `is_global = false`

### Requirement: User Branch Assignment
Every user SHALL be assigned to exactly one branch via a required `users.branch_id`.

#### Scenario: New user requires a branch
- **WHEN** an admin creates a user without selecting a branch
- **THEN** validation fails and the user is not created

#### Scenario: Existing users backfilled
- **WHEN** the branch-assignment migration runs against pre-existing users
- **THEN** every existing user is assigned to the Pusat branch

### Requirement: Branch-Scoped Content Ownership
Leagues, activities, and teams SHALL carry a nullable `branch_id`, where a non-null value denotes branch-owned content and `null` denotes national content visible to all. Sports SHALL remain global and unscoped.

#### Scenario: National content on migration
- **WHEN** the content branch-column migration runs against pre-existing leagues, activities, and teams
- **THEN** those records retain a `null` branch_id and are treated as national

#### Scenario: Sports are not branch-scoped
- **WHEN** any admin views the sports list
- **THEN** all sports are shown regardless of branch

### Requirement: Headquarters All-Branch Admin Access
An admin whose branch has `is_global = true` (a Pusat admin) SHALL be able to view and manage data across all branches and national content.

#### Scenario: Pusat admin sees every branch
- **WHEN** a Pusat admin opens an admin list of leagues, activities, teams, or users
- **THEN** records from all branches and national records are returned

#### Scenario: Pusat admin manages a foreign-branch record
- **WHEN** a Pusat admin updates a league owned by the DKI branch
- **THEN** the update is authorized and succeeds

### Requirement: Branch-Scoped Admin Management
An admin whose branch is not global SHALL only view and manage content owned by their own branch, and SHALL only manage users belonging to their own branch.

#### Scenario: Branch admin list is scoped
- **WHEN** a DKI admin opens an admin list of leagues, activities, teams, or users
- **THEN** only DKI-owned records (and DKI users) are returned
- **AND** national and other-branch records are excluded

#### Scenario: Branch admin blocked from foreign-branch record
- **WHEN** a DKI admin requests show/edit/update/delete on a Jateng-owned or national league, activity, or team by its id
- **THEN** the request is denied with an authorization error

### Requirement: Automatic Branch Assignment on Creation
When a non-global (branch) admin creates a league, activity, or team, the system SHALL assign the new record to that admin's branch. A Pusat admin SHALL be able to choose the owning branch, including national (no branch).

#### Scenario: Branch admin creation auto-assigns branch
- **WHEN** a DKI admin creates a league without specifying a branch
- **THEN** the league's branch_id is set to the DKI branch

#### Scenario: Pusat admin chooses branch
- **WHEN** a Pusat admin creates a league and selects "National"
- **THEN** the league is created with a `null` branch_id

### Requirement: Member Branch-Scoped Visibility
On member-facing pages, a member SHALL see national content plus content owned by their own branch, and SHALL NOT see other branches' content. This rule applies to all members regardless of branch, including members of the Pusat branch.

#### Scenario: Member sees national and own-branch content
- **WHEN** a DKI member views leagues, activities, teams, or leaderboards
- **THEN** national records and DKI-owned records are shown
- **AND** records owned by other branches are excluded

#### Scenario: Pusat member has no all-branch access
- **WHEN** a Pusat member views leagues, activities, teams, or leaderboards
- **THEN** only national records and Pusat-owned records are shown

#### Scenario: Member blocked from foreign-branch detail
- **WHEN** a DKI member opens the detail or match page of a Jateng-owned league by its id
- **THEN** the record is not found for that member

### Requirement: Authentication Integrity Under Branch Scoping
Branch scoping SHALL NOT alter authentication, login, notification routing, or relation lookups on the `User` model; user records SHALL remain globally resolvable outside of explicit admin user listings.

#### Scenario: Login unaffected by branch scoping
- **WHEN** a user logs in
- **THEN** authentication resolves the user regardless of the acting branch context

### Requirement: Branch Context In Shared Props
The application SHALL expose the authenticated user's branch via Inertia shared props so the UI can display branch context and show branch selection only where permitted.

#### Scenario: Branch present in shared props
- **WHEN** an authenticated user loads any page
- **THEN** the shared `auth.user` payload includes the user's branch
