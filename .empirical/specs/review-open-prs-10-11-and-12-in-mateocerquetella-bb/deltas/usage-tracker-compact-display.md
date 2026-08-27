# Usage Tracker Compact Display Delta

## Purpose

Define which provider usage window appears in the compact sidebar reading.

## ADDED Requirements

### Requirement: Configurable compact limit

Usage Tracker SHALL let the user select Weekly or Five-hour as the compact
sidebar limit. Weekly SHALL be the default for new, legacy, missing, and unknown
preference values. The compact percentage and progress bar SHALL update when the
setting changes without hiding either window from expanded details.

#### Scenario: Preferred window is available

- **GIVEN** Weekly is selected and both windows are reported
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
