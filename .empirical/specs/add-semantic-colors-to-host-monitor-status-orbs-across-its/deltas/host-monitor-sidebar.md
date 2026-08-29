# Host Monitor sidebar

## ADDED Requirements

### Requirement: Semantic per-host status orbs

The compact popover and floating Host Monitor SHALL expose each host's derived
status tone on its row and SHALL render the decorative status orb with BB's
semantic success, warning, destructive, or muted tokens. Disconnected/offline
state SHALL override retained health severity, stale and failed readings SHALL
be attention, and sampling or unavailable/unknown states SHALL remain neutral.
Visible connectivity and health/freshness text SHALL remain the authoritative
non-color signal.

#### Scenario: Compare connected host severities

- **GIVEN** fresh connected hosts are healthy, attention, and critical
- **WHEN** their compact or floating rows render
- **THEN** their orbs are green, yellow, and red respectively
- **AND** the row text still names each connectivity and health state.

#### Scenario: Render a disconnected or indeterminate host

- **GIVEN** a host is disconnected, sampling, unavailable, or otherwise lacks
  a known current health state
- **WHEN** its compact or floating row renders
- **THEN** its orb is neutral gray rather than a success color
- **AND** the visible copy reports Disconnected, Sampling, Offline,
  Unavailable, or the applicable freshness state.
