# Plugin Git Distribution Delta

## MODIFIED Requirements

### Requirement: Active Git-only install surfaces

Taskboard, Usage Tracker, and Host Monitor SHALL expose only BB Community and
immutable Git release sources in current user-facing documentation,
automation, and marketplace metadata. Host Monitor's sole active plugin id
SHALL be `host-monitor`. Their main-line workspaces SHALL be private and SHALL
omit npm publication configuration and hooks.

#### Scenario: Discover the renamed Host Monitor

- **WHEN** a user reads the catalog, resolves the collection entry, or installs
  the direct Host Monitor Git range
- **THEN** the id, subdirectory, package, and tag prefix resolve as
  `host-monitor`, `plugins/host-monitor`, `bb-plugin-host-monitor`, and
  `host-monitor/`
- **AND** no active alias or duplicate `machine-monitor` listing is offered

#### Scenario: Build the renamed Git-only workspace

- **WHEN** a contributor installs dependencies and runs the root check
- **THEN** Host Monitor resolves BB 0.40 / plugin SDK 0.4.21 under its renamed
  workspace identity
- **AND** its tests and server/app/host artifacts all report `host-monitor`

### Requirement: Preserve distribution history

The retired annotated `machine-monitor/v0.1.0` tag SHALL remain immutable at
its original release commit. New Host Monitor distribution SHALL begin at a
separate annotated `host-monitor/v0.1.0` tag on the reviewed rename commit.

#### Scenario: Publish the renamed identity

- **WHEN** the approved rename release and marketplace metadata are delivered
- **THEN** the new tag, subdirectory, marketplace entry, icon, and install
  commands use only `host-monitor`
- **AND** the retired tag still peels to
  `9db09cc35553493113f31e5352a44911ae92bc73` without being moved or deleted

## ADDED Requirements

### Requirement: Migrate a local Host Monitor identity safely

The local development installation SHALL retain its effective non-secret
threshold settings while moving to the new plugin id, and SHALL never retain
two active Host Monitor samplers after migration completes.

#### Scenario: Replace the installed local path identity

- **GIVEN** `machine-monitor` is installed from a local path
- **WHEN** the rename is exercised live
- **THEN** its settings are captured before `host-monitor` is installed and
  applied to the new id
- **AND** the retired id is removed only after the new plugin and sampler are
  running successfully
