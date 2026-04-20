# user-auth Specification

## Purpose
TBD - created by archiving change add-jrclub-mvp. Update Purpose after archive.
## Requirements
### Requirement: User Registration
The system SHALL allow new users to register with email and password. Upon registration, the user SHALL be assigned the "member" role by default.

#### Scenario: Successful registration
- **WHEN** a user submits a valid email and password
- **THEN** a new account is created with role "member"
- **AND** the user is automatically logged in

#### Scenario: Duplicate email
- **WHEN** a user submits an email that already exists
- **THEN** the system rejects registration with an error message

### Requirement: User Login
The system SHALL allow registered users to log in with email and password.

#### Scenario: Successful login
- **WHEN** a user submits valid credentials
- **THEN** the user is authenticated and redirected to the home screen

#### Scenario: Invalid credentials
- **WHEN** a user submits invalid credentials
- **THEN** the system displays an authentication error

### Requirement: Role-Based Access Control
The system SHALL enforce two roles: "member" and "admin". Admins SHALL have access to all management features. Members SHALL have access to participation features only.

#### Scenario: Admin access
- **WHEN** an admin user accesses management features (create activities, manage leagues, manage users)
- **THEN** access is granted

#### Scenario: Member restricted
- **WHEN** a member attempts to access admin-only features
- **THEN** access is denied

### Requirement: User Logout
The system SHALL allow authenticated users to log out, clearing their session.

#### Scenario: Successful logout
- **WHEN** a user triggers logout
- **THEN** the session is cleared and the user is redirected to the login screen

