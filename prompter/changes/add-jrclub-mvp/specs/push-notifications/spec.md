## ADDED Requirements

### Requirement: Notification Permission
The system SHALL request push notification permission from users via the Web Push API. Users SHALL be able to opt in or out.

#### Scenario: User grants permission
- **WHEN** a user accepts the push notification prompt
- **THEN** the device is registered for push notifications

#### Scenario: User denies permission
- **WHEN** a user denies the push notification prompt
- **THEN** the app continues to function without push notifications

### Requirement: Activity Notifications
The system SHALL send push notifications for activity-related events: new activity created (matching user's preferred sports), activity reminder (before scheduled time), and activity cancelled.

#### Scenario: New activity notification
- **WHEN** an admin creates a new activity
- **THEN** members receive a push notification about the new activity

#### Scenario: Activity reminder
- **WHEN** an activity is approaching its scheduled time
- **THEN** joined participants receive a reminder notification

### Requirement: Match Notifications
The system SHALL send push notifications for match events: match starting soon, match score updates, and match completed.

#### Scenario: Match starting notification
- **WHEN** a match is about to start
- **THEN** members of the participating teams receive a notification

#### Scenario: Match result notification
- **WHEN** a match is completed
- **THEN** league participants receive a notification with the final score
