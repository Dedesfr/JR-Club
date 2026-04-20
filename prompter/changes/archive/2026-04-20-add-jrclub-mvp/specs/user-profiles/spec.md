## ADDED Requirements

### Requirement: View Profile
The system SHALL display a user's profile including name, email, role, teams, activity history, and player statistics.

#### Scenario: View own profile
- **WHEN** a user navigates to their profile
- **THEN** their name, email, role, teams, recent activities, and stats are displayed

#### Scenario: View other user's profile
- **WHEN** a user views another member's profile
- **THEN** the member's name, teams, and public stats are displayed (email hidden)

### Requirement: Edit Profile
The system SHALL allow users to edit their own profile name.

#### Scenario: Update name
- **WHEN** a user updates their name on the profile page
- **THEN** the name is saved and reflected across the app

### Requirement: Activity History
The system SHALL display a chronological list of activities a user has participated in.

#### Scenario: View activity history
- **WHEN** a user views the activity history section of a profile
- **THEN** past activities are listed with sport type, date, and location
