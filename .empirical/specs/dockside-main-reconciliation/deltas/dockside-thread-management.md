# Capability Delta: Dockside Thread Management

## ADDED Requirements

### Requirement: Dockside coexists with the current plugin workspace

Dockside MUST remain an independently installable plugin in the repository's
current npm workspace while Taskboard and every other plugin retained by main
remain present under their own identities. The obsolete t3sidebar identity
MUST NOT reappear, and resolving shared rename history MUST NOT change
Dockside's verified sidebar behavior or persisted settings.

#### Scenario: The Dockside branch incorporates current main

- **Given** main renamed the common t3sidebar ancestor to Taskboard
- **And** the feature branch renamed that ancestor to Dockside
- **When** the histories are reconciled
- **Then** both `plugins/taskboard` and `plugins/dockside` are installable
- **And** `plugins/t3sidebar` is absent
- **And** main's npm workspace checks pass
- **And** Dockside's verified thread-management behavior is unchanged
