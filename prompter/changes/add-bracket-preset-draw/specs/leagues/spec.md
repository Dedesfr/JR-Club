## ADDED Requirements

### Requirement: Bracket Preset Draw
The system SHALL allow admins of tournament leagues (those that seed a bracket, whether `start_stage = bracket` or `start_stage = group`) to configure a predetermined bracket draw. An admin SHALL be able to enable a per-league bracket preset, set a reveal number `N` (the seed attempt on which the preset appears), and pre-assign the first-round slot layout where each slot holds a league entry or a BYE. The system SHALL persist a per-league seed attempt counter that increments on each bracket seed. When the counter reaches `N`, that seed SHALL place entries into the upper bracket according to the preset slot layout exactly (bypassing automatic bye placement) and the counter SHALL reset to `0`; all other seeds SHALL retain their existing behavior.

#### Scenario: Save a bracket preset
- **WHEN** an admin of a tournament league enables the preset, sets `N = 5`, and assigns a first-round slot layout of entries and BYEs
- **THEN** the preset settings and slot layout are persisted on the league

#### Scenario: Preset available for group-start leagues
- **WHEN** an admin of a `start_stage = group` league enables the preset and sets `N`
- **THEN** the preset settings are persisted, because the group stage also progresses to a bracket

#### Scenario: Reveal preset on the Nth seed
- **WHEN** the preset is enabled with `N = 5` and the admin clicks "Seed brackets" for the fifth time
- **THEN** the upper bracket is seeded from the preset slot layout exactly
- **AND** the seed attempt counter resets to `0`

#### Scenario: Non-Nth seeds are unaffected
- **WHEN** the preset is enabled with `N = 5` and the admin clicks "Seed brackets" for the second time
- **THEN** the bracket is seeded using the league's normal seeding behavior
- **AND** the seed attempt counter is incremented but not reset

#### Scenario: Reject duplicate slot assignments
- **WHEN** an admin submits a preset slot layout that assigns the same league entry to more than one slot
- **THEN** the request is rejected with a validation error
