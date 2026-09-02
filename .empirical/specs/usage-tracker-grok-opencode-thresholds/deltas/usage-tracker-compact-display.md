# Usage Tracker Compact Display Delta

## ADDED Requirements

### Requirement: Wrapped multi-provider strip

Usage Tracker SHALL retain the existing compact single-row presentation for one
or two enabled providers. For three through six providers it SHALL use a
two-column layout of at most three provider rows, keep exactly one reachable
refresh control, and preserve provider-specific details and focus behavior.

#### Scenario: Four providers are enabled

- **GIVEN** Claude Code, Codex, Grok, and OpenCode are enabled
- **WHEN** the sidebar strip renders
- **THEN** the four provider controls render in stable order across two rows
- **AND** the refresh action remains reachable without overlaying a provider

#### Scenario: Existing compact configuration is retained

- **GIVEN** one or two providers are enabled
- **WHEN** the sidebar strip renders
- **THEN** it remains a single compact row with the current interaction model

### Requirement: Usage severity thresholds

Usage Tracker SHALL classify finite raw usage below 80% as normal, usage at
least 80% and below 95% as warning, and usage at least 95% as critical. Compact
and expanded percentages and fills SHALL render warning in yellow and critical
in red; missing windows SHALL remain neutral. Bar geometry SHALL remain clamped
independently from severity.

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
