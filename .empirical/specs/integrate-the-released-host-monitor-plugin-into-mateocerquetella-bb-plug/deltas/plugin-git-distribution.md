# Plugin Git Distribution Delta

## MODIFIED Requirements

### Requirement: Active Git-only install surfaces

Taskboard, Usage Tracker, and Host Monitor SHALL expose only BB Community and
immutable Git release sources in current user-facing documentation,
automation, and marketplace metadata. Their main-line workspaces SHALL be
private and SHALL omit npm publication configuration and hooks.

#### Scenario: Discover every tracked plugin

- **WHEN** a user reads the root plugin catalog or installs from the repository
  collection manifest
- **THEN** Host Monitor appears beside Taskboard and Usage Tracker
- **AND** its direct install path resolves through the `machine-monitor/`
  semver tag prefix rather than npm

#### Scenario: Build the Git-only workspace

- **WHEN** a contributor installs dependencies and runs the root check contract
- **THEN** Host Monitor resolves its pinned BB/plugin SDK toolchain
- **AND** its typecheck, tests, server/app/host builds, and package identity
  complete with the other workspace plugins

### Requirement: Preserve distribution history

The immutable `machine-monitor/v0.1.0` release and marketplace submission SHALL
remain unchanged while the released source is added to `main` for future
tracking.

#### Scenario: Integrate after an off-main release

- **WHEN** Host Monitor is transplanted onto a main-based review branch
- **THEN** no existing release tag is moved or replaced
- **AND** marketplace PR #128 continues to reference the reviewed v0.1.0 tag
