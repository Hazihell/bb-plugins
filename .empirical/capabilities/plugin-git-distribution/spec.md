# Plugin Git Distribution Specification

## Purpose

Define the shared active distribution boundary for repository plugins whose
installable releases live in Git rather than the npm registry.

## Requirements

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

### Requirement: Preserve Git-build package tooling

Git-only distribution SHALL retain the package manifests, stable package names,
workspace/lockfile dependency graph, source entry points, and package-manager
development commands required to install dependencies, build, test, and derive
BB plugin identity.

#### Scenario: Distinguish tooling from distribution

- **WHEN** an active audit encounters `package.json`, lockfile package records,
  `@get-bb/plugin-sdk`, or npm install/run development commands
- **THEN** those build and identity contracts remain intact
- **AND** none is treated as evidence that either plugin is published to npm

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

### Requirement: Patch-release version coherence

When a repository plugin patch release is prepared, its active manifest,
workspace lock record, changelog or release-facing documentation, distribution
guards, and generated BB metadata MUST agree on the exact version while the
package remains private and Git-only. Preparation MUST NOT create or move a
remote tag or release without separate authorization.

#### Scenario: Prepare the current local patch releases

- **WHEN** Taskboard `0.3.2`, Host Monitor `0.1.2`, and Usage Tracker `0.1.4`
  are prepared together
- **THEN** every active version-bearing surface and build artifact reports its
  plugin's exact current version
- **AND** no commit, push, tag, publication, GitHub Release, or marketplace
  mutation occurs.
