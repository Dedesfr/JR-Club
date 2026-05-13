## ADDED Requirements
### Requirement: Score Difference in Standings
The system SHALL include a signed `score_difference` value in league standings rows, computed as the accumulated points-for minus points-against across all completed-match sets for that entry or team, and member-facing league standings SHALL display it as a dedicated column.

#### Scenario: Score difference is positive
- **WHEN** an entry has accumulated more points scored than conceded across completed matches
- **THEN** the standings row exposes `score_difference` as a positive integer
- **AND** the member league detail page renders it with a leading `+`

#### Scenario: Score difference is negative
- **WHEN** an entry has conceded more points than it has scored
- **THEN** the standings row exposes `score_difference` as a negative integer
- **AND** the member league detail page renders it with a leading `-`

#### Scenario: No completed matches
- **WHEN** an entry has no completed matches
- **THEN** `score_difference` is `0`

### Requirement: Member Dashboard Landing Page
The system SHALL provide a member dashboard at `/dashboard` that summarises the signed-in user's upcoming matches, recent results, teams, and ongoing leagues, replacing the previous redirect to the leagues index.

#### Scenario: Member opens the dashboard
- **WHEN** an authenticated member visits `/dashboard`
- **THEN** the page shows their upcoming matches, recent results, teams they belong to, and the ongoing competitions they participate in

#### Scenario: Member has no activity
- **WHEN** an authenticated member with no teams, entries, or scheduled matches visits `/dashboard`
- **THEN** the page renders with empty-state messaging for each section instead of redirecting

### Requirement: Uniform League and Activity Listings
Member-facing league and activity index pages SHALL render every item with the same card variant; no item is visually emphasised as "featured".

#### Scenario: League index has no featured highlight
- **WHEN** a member opens the league index
- **THEN** every league card is rendered in the standard styling without a featured/banner highlight

#### Scenario: Activity index has no featured highlight
- **WHEN** a member opens the activity index
- **THEN** every activity card is rendered in the standard styling without a featured/banner highlight
