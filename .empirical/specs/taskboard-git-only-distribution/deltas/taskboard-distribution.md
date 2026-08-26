# Taskboard Git-only Distribution Delta

## REMOVED Requirements

### Requirement: Immutable npm release

Taskboard no longer publishes new versions to npm. The workspace SHALL retain
npm-compatible package metadata only where BB Git installation, dependency
resolution, and repository build tooling require it.

#### Scenario: Retire npm distribution

- **WHEN** Taskboard adopts Git-only releases
- **THEN** no active manifest, documentation, or release process offers npm
  publication for Taskboard

## ADDED Requirements

### Requirement: Immutable Git release

Every Taskboard release SHALL bind one reviewed Git commit, one immutable
`taskboard/vX.Y.Z` annotated tag, and one GitHub Release. A Taskboard workspace
SHALL be marked private/non-publishable and SHALL omit npm publication,
packaging, and prepack configuration.

#### Scenario: Install Taskboard 0.3.0 directly

- **WHEN** a user installs Git range `^0.3.0` with subdirectory
  `plugins/taskboard` and tag prefix `taskboard/`
- **THEN** BB resolves public tag `taskboard/v0.3.0` and its immutable commit
- **AND** builds the plugin from the reviewed Git source

## MODIFIED Requirements

### Requirement: Marketplace range alignment

The BB Community Taskboard entry SHALL reference the public Git repository,
plugin subdirectory, semver range, and Taskboard tag prefix that resolve the
current immutable Git release while preserving listing identity.

#### Scenario: Resolve the marketplace release

- **WHEN** the marketplace validates Taskboard range `^0.3.0`
- **THEN** it resolves `taskboard/v0.3.0` from the public repository
- **AND** marketplace build and Git-source liveness checks pass without npm
