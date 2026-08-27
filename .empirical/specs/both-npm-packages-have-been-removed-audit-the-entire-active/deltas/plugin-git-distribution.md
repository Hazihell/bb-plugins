# Plugin Git Distribution Delta

## Purpose

Define the shared active distribution boundary for repository plugins whose
installable releases live in Git rather than the npm registry.

## ADDED Requirements

### Requirement: Active Git-only install surfaces

Taskboard and Usage Tracker SHALL expose only BB Community and immutable Git
release sources in current user-facing documentation, automation, and
marketplace metadata. Their workspaces SHALL be private and SHALL omit npm
publication configuration and hooks.

#### Scenario: Audit current distribution surfaces

- **WHEN** active README, changelog, manifest, CI, config, and marketplace files
  are searched for either plugin's former registry source
- **THEN** no npm package badge, package URL, `npm:` plugin source, publish or
  unpublish command, publishing token/config, or npm marketplace source remains
- **AND** both documented install paths resolve through BB Community or the
  plugin's public Git tag range

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

Historical Empirical records SHALL retain their accurate npm attempt,
publication, failure, deletion, and migration evidence while current install
surfaces remain Git-only.

#### Scenario: Complete a current cleanup

- **WHEN** stale active distribution copy is removed
- **THEN** immutable historical specifications, receipts, and release artifacts
  remain byte-valid
- **AND** the current repository clearly separates history from supported
  installation paths
