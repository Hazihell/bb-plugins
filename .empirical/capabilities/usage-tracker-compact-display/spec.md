# Usage Tracker Compact Display Specification

## Purpose

Define which provider usage window appears in the compact sidebar reading.

## Requirements

### Requirement: Configurable compact limit

Usage Tracker SHALL let the user select Weekly or Five-hour as the compact
sidebar limit. Weekly SHALL be the default for new, legacy, missing, and unknown
preference values. The compact percentage and progress bar SHALL update when the
setting changes without hiding any provider-reported window from expanded
details. Expanded details SHALL render the canonical five-hour and weekly rows
first, followed by every additional current provider window in source order and
under its original label. Last-known reconciliation SHALL retain a missing
canonical category and every additional window whose exact label is omitted by
a partial refresh. A current canonical category or exact additional-window
label SHALL remain authoritative.

#### Scenario: Preferred window is available

- **GIVEN** Weekly is selected and both canonical windows are reported
- **WHEN** the compact provider reading renders
- **THEN** its percentage and progress bar use the weekly window
- **AND** expanded details still show both weekly and five-hour windows

#### Scenario: Preferred window is missing

- **GIVEN** Five-hour is selected but only the weekly window is reported
- **WHEN** the compact provider reading renders
- **THEN** it falls back to the weekly window rather than showing no limit

#### Scenario: Legacy value is loaded

- **WHEN** stored or RPC preference data omits or provides an unknown compact
  limit
- **THEN** Usage Tracker normalizes the effective value to Weekly

#### Scenario: Provider reports an additional window

- **GIVEN** Claude Code reports `Current session`, `Weekly limit`, and `Fable`
- **WHEN** the user opens expanded usage details
- **THEN** the card shows the five-hour and weekly rows followed by `Fable`
- **AND** the compact reading still shows only its configured canonical window

#### Scenario: Partial refresh omits a known additional window

- **GIVEN** the last-known snapshot contains a `Fable` window
- **WHEN** a later snapshot omits `Fable` but contains updated canonical values
- **THEN** the current canonical values remain authoritative
- **AND** the last-known `Fable` row remains available without duplication
