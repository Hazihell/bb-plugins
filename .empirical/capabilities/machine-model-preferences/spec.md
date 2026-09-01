# Machine Model Preferences Specification

## Purpose

Remember execution choices per machine so users can keep different defaults on local and remote hosts.

## Requirements

### Requirement: Host-scoped provider and execution preferences
The plugin SHALL persist provider by host, and model/reasoning by host and provider, with unscoped browser values available as fallback.

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
