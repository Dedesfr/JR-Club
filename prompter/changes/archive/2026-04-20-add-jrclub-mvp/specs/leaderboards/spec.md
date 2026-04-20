## ADDED Requirements

### Requirement: League Leaderboard
The system SHALL display a leaderboard for each league showing team rankings based on points, goal difference, and goals scored.

#### Scenario: View league leaderboard
- **WHEN** a user navigates to a league's leaderboard
- **THEN** teams are listed in order of ranking with stats (played, won, drawn, lost, GF, GA, GD, points)

#### Scenario: Leaderboard updates after match
- **WHEN** a match result is finalized
- **THEN** the leaderboard reflects the updated standings in real-time

### Requirement: Overall Leaderboard
The system SHALL provide an overall leaderboard across all leagues, aggregating team performance per sport type.

#### Scenario: View overall leaderboard by sport
- **WHEN** a user selects a sport type on the overall leaderboard
- **THEN** teams are ranked by cumulative performance across all leagues of that sport

### Requirement: Player Statistics
The system SHALL track and display individual player participation statistics including total activities joined, matches played, and win rate.

#### Scenario: View player stats
- **WHEN** a user views a player's profile
- **THEN** participation stats are displayed (activities joined, matches played, win percentage)
