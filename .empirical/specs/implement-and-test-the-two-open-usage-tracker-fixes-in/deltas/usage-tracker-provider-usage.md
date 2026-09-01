# Usage Tracker Provider Usage Delta

## Purpose

Normalize evolving BB provider response shapes into stable Usage Tracker
semantics without allowing one absent integration to erase healthy providers.

## ADDED Requirements

### Requirement: Compatible provider response normalization

Usage Tracker SHALL map the current BB usage wire keys `codex`, `claude-code`,
and `acp-cursor` to the stable plugin provider IDs `codex`, `claudeCode`, and
`cursor`. It SHALL continue to accept the legacy `claudeCode` and `cursor` wire
aliases supported by its declared BB engine range. When both forms exist, the
current BB wire key SHALL take precedence.

#### Scenario: Normalize current BB provider keys

- **WHEN** BB reports healthy Claude Code data under `claude-code` and Cursor
  data under `acp-cursor`
- **THEN** the Usage Tracker snapshot contains those values under the stable
  `claudeCode` and `cursor` provider IDs
- **AND** preferences and frontend identifiers remain unchanged

#### Scenario: Normalize a legacy response

- **WHEN** an older compatible BB release reports providers under `claudeCode`
  and `cursor`
- **THEN** Usage Tracker retains their status and usage windows

#### Scenario: Current and legacy aliases coexist

- **WHEN** both `claude-code` and `claudeCode` are present in one response
- **THEN** Usage Tracker uses the value from `claude-code`

### Requirement: Missing-provider fault isolation

An absent provider response SHALL normalize as an `error` with a provider-local
unavailable message, without preventing any other provider from producing a
snapshot. It SHALL NOT claim that a provider is uninstalled unless BB reports
that status.

#### Scenario: One response key is absent

- **GIVEN** Codex and Claude Code return healthy usage data
- **WHEN** no Cursor key is present
- **THEN** Codex and Claude Code remain available with their windows intact
- **AND** only Cursor is reported as unavailable
