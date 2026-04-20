# sport-activities Specification

## Purpose
TBD - created by archiving change add-jrclub-mvp. Update Purpose after archive.
## Requirements
### Requirement: Create Activity
The system SHALL allow admins to create sport activities specifying sport type, title, description, location, date/time, and maximum participants.

#### Scenario: Admin creates activity
- **WHEN** an admin submits a valid activity form
- **THEN** a new activity is created with status "open"
- **AND** the activity appears in the activity list

#### Scenario: Member cannot create activity
- **WHEN** a member attempts to create an activity
- **THEN** the action is denied

### Requirement: Browse Activities
The system SHALL display a list of upcoming activities that users can browse and filter by sport type.

#### Scenario: View activity list
- **WHEN** a user opens the activities page
- **THEN** upcoming activities are displayed sorted by date
- **AND** each activity shows sport type, title, location, date/time, and available spots

#### Scenario: Filter by sport
- **WHEN** a user selects a sport type filter
- **THEN** only activities of that sport type are shown

### Requirement: Join Activity
The system SHALL allow members to join open activities until the maximum participant limit is reached.

#### Scenario: Successfully join activity
- **WHEN** a member joins an activity with available spots
- **THEN** the member is added to the participant list
- **AND** the available spots count decreases

#### Scenario: Activity full
- **WHEN** a member attempts to join an activity at maximum capacity
- **THEN** the join action is denied with a "full" message

#### Scenario: Leave activity
- **WHEN** a member leaves an activity they joined
- **THEN** the member is removed from the participant list
- **AND** the available spots count increases

### Requirement: Activity Status Management
The system SHALL support activity statuses: open, full, completed, and cancelled. Admins SHALL be able to mark activities as completed or cancelled.

#### Scenario: Auto-full status
- **WHEN** the last available spot is taken
- **THEN** the activity status changes to "full"

#### Scenario: Admin completes activity
- **WHEN** an admin marks an activity as completed
- **THEN** the activity status changes to "completed"

