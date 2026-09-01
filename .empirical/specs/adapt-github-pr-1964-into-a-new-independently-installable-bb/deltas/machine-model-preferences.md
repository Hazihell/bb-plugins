# Project model preferences

## Purpose
Remember execution choices per project so users can keep different defaults across projects and hosts.

## ADDED Requirements

### Requirement: Project and host-scoped provider and execution preferences
The plugin SHALL persist provider, model, and reasoning by project, host, and provider, with unscoped browser values available as fallback.

#### Scenario: Separate hosts
- GIVEN host A and host B have different saved selections
- WHEN each host is read
- THEN each returns only its own provider/model/reasoning values.

### Requirement: Safe localStorage handling
The plugin SHALL ignore malformed values and SHALL never use a reused-environment selection as a durable default.

#### Scenario: Invalid storage
- GIVEN localStorage contains invalid or unsupported values
- WHEN preferences are loaded
- THEN the invalid value is ignored and fallback is returned.
