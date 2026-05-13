## ADDED Requirements
### Requirement: Admin Match Set Controls
The admin area SHALL expose controls on the match detail page for an admin to lock or unlock a match, and to edit or delete an individual recorded set, with all destructive controls disabled while the match is locked.

#### Scenario: Admin sees lock and set controls
- **WHEN** an admin opens a match detail page
- **THEN** a lock/unlock toggle is visible
- **AND** each recorded set row shows edit and delete affordances

#### Scenario: Controls disabled when locked
- **WHEN** an admin views a locked match
- **THEN** the "add set" form is hidden
- **AND** the per-set edit and delete affordances are disabled or hidden

#### Scenario: Non-admin sees no controls
- **WHEN** a non-admin views the same match detail page
- **THEN** no lock, edit, or delete controls are rendered
