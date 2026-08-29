# Host Monitor fleet presentation

## Purpose

Present each monitored host's connection, freshness, and health state
consistently across Host Monitor's responsive dashboard layouts without making
color the only status signal.

## ADDED Requirements

### Requirement: Consistent dashboard status orbs

Host Monitor's dashboard identity rows, host cards, and health badges SHALL use
the same semantic orb mapping as the compact monitor: connected healthy is
success green, attention is warning yellow, critical is destructive red, and
offline/disconnected or unavailable is muted gray. Disconnected connectivity
SHALL take visual precedence over any retained health tone. Orb color SHALL be
additive to visible state labels and SHALL NOT color the labels themselves.

#### Scenario: Scan the fleet dashboard

- **GIVEN** the visible fleet contains healthy, attention, critical, and
  disconnected hosts
- **WHEN** the user views the table, compact list, or host-card layout
- **THEN** the host orbs consistently use green, yellow, red, and muted gray
- **AND** the associated status and freshness labels remain visible.

#### Scenario: Preserve disconnected precedence

- **GIVEN** a disconnected host retains a prior attention or critical health
  value
- **WHEN** any dashboard identity or card orb renders
- **THEN** the orb is muted gray rather than yellow or red.
