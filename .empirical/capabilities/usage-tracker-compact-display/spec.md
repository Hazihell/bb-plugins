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

### Requirement: Wrapped multi-provider strip

Usage Tracker SHALL retain the existing compact single-row presentation for one
or two enabled providers. For more than two providers it SHALL render one
compact summary showing the highest available usage percentage and `+N` for the
other enabled providers beside exactly one refresh control. Activating the
summary SHALL open an accessible overview list in stable provider order;
activating a row SHALL open its provider details and closing details SHALL
return to the overview with predictable focus.

#### Scenario: Four providers are enabled

- **GIVEN** Claude Code, Codex, Grok, and OpenCode are enabled
- **WHEN** the sidebar strip renders
- **THEN** the footer shows the highest available percentage followed by `+3`
- **AND** the refresh action remains reachable beside the summary
- **AND** opening the summary lists all four providers in stable order

#### Scenario: Existing compact configuration is retained

- **GIVEN** one or two providers are enabled
- **WHEN** the sidebar strip renders
- **THEN** it remains a single compact row with the current interaction model

### Requirement: Usage severity thresholds

Usage Tracker SHALL classify finite raw usage below 80% as normal, usage at
least 80% and below 95% as warning, and usage at least 95% as critical. Compact
summary, overview, and expanded percentages/fills SHALL render warning in
yellow and critical in red; missing windows SHALL remain neutral. Summary
severity SHALL follow its highest displayed usage. Bar geometry SHALL remain
clamped independently from severity.

#### Scenario: Warning boundary

- **WHEN** a usage window reports exactly 80%
- **THEN** its compact or expanded reading and fill use warning presentation

#### Scenario: Critical boundary

- **WHEN** a usage window reports exactly 95% or more than 100%
- **THEN** its compact or expanded reading and fill use critical presentation
- **AND** its fill width does not exceed 100%

#### Scenario: Below warning threshold

- **WHEN** a usage window reports 79.9% or is missing
- **THEN** its presentation remains neutral
