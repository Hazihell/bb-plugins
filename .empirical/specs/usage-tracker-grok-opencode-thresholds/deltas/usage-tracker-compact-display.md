# Usage Tracker Compact Display Delta

## ADDED Requirements

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
