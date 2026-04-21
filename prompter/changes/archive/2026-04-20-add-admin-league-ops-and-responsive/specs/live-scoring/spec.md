## ADDED Requirements

### Requirement: Match Player Substitution
The system SHALL let admins activate a declared substitute on a specific match, preserving the original player in the entry roster and recording an auditable substitution row.

#### Scenario: Activate declared substitute
- **WHEN** an admin submits a substitution for a match specifying the entry, the original player, and a substitute drawn from that entry's declared substitutes
- **THEN** a `match_substitutions` row is created with `activated_at` set to the current time
- **AND** subsequent match views show the substitute as the active player for that entry

#### Scenario: Reject undeclared substitute
- **WHEN** an admin submits a substitution whose substitute is not among the entry's declared substitutes
- **THEN** the request is rejected with a validation error
- **AND** no substitution row is created

### Requirement: Match Documentation Uploads
The system SHALL let admins attach image files (JPEG, PNG, WEBP) as documentation to any match, store them on the `public` disk, and expose them on the match view.

#### Scenario: Upload a valid photo
- **WHEN** an admin uploads a JPEG image under 5 MB to a match
- **THEN** the file is saved under `matches/{match_id}/` on the `public` disk
- **AND** a `match_documents` row records its path, original name, and uploader

#### Scenario: Reject oversize file
- **WHEN** an admin uploads a file larger than 5 MB or with a disallowed mime type
- **THEN** the upload is rejected with a validation error
- **AND** no file is stored on disk and no row is created

#### Scenario: Delete a photo
- **WHEN** an admin deletes a match document
- **THEN** the `match_documents` row is removed
- **AND** the file is deleted from the `public` disk
