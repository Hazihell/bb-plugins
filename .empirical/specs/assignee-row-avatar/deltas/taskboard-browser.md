# Taskboard Browser Delta

## MODIFIED Requirements

### Requirement: Restrained responsive List presentation

Taskboard SHALL render List rows as compact flat content with semantic state
shape and restrained color, neutral sticky group headings, stable aligned
metadata, and a readable capped List measure. Assigned people in List rows and
Kanban cards SHALL use compact, accessible initials avatars whose
provider-neutral tone is derived deterministically from the normalized assignee
name. The avatar SHALL retain a 20px footprint, theme-safe contrast, a visible
ring, and the full assignee name for assistive technology and tooltip
disclosure. Unassigned work SHALL continue to omit the marker. Kanban SHALL
retain full available width and existing movement behavior.

#### Scenario: Wide List and Kanban

- **WHEN** the user switches a wide project board between List and Kanban
- **THEN** List content is capped near 56rem while Kanban uses the full board
  width
- **AND** neither mode loses provider status names or actions

#### Scenario: Scan assigned rows

- **GIVEN** several visible work items have assignees
- **WHEN** the user scans List or Kanban
- **THEN** each assigned item shows a crisp 20px initials avatar
- **AND** the same assignee uses the same tone everywhere
- **AND** row/card geometry does not grow

#### Scenario: Identify without color

- **GIVEN** an assignee avatar is visible
- **WHEN** assistive technology reads the marker or the user opens its tooltip
- **THEN** Taskboard exposes `Assigned to <full name>`
- **AND** initials or palette color are not the sole identity signal

#### Scenario: Preserve provider behavior

- **GIVEN** the item is GitHub, Linear, or Jira work
- **WHEN** Taskboard renders the assignee marker
- **THEN** it uses the existing assignee display string without fetching an
  avatar or changing provider, filtering, navigation, or mutation contracts
