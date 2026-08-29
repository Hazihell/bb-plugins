# Taskboard Distribution Specification

## Purpose

Define reproducible, immutable Taskboard release and marketplace provenance.

## Requirements

### Requirement: Marketplace range alignment

The BB Community Taskboard entry SHALL reference the public Git repository,
plugin subdirectory, semver range, and Taskboard tag prefix that resolve the
current immutable Git release while preserving listing identity.

#### Scenario: Resolve the marketplace release

- **WHEN** the marketplace validates Taskboard range `^0.3.0`
- **THEN** it resolves `taskboard/v0.3.0` from the public repository
- **AND** marketplace build and Git-source liveness checks pass without npm

### Requirement: Immutable Git release

Every Taskboard release SHALL bind one reviewed Git commit whose active
manifest, lockfile, changelog/release-facing documentation, distribution tests,
and build metadata agree on the exact version to one immutable
`taskboard/vX.Y.Z` annotated tag and one GitHub Release. A Taskboard workspace
SHALL remain private/non-publishable and SHALL omit npm publication, packaging,
and prepack configuration. Release preparation SHALL stop before remote
mutation unless exact authorization is supplied.

#### Scenario: Prepare Taskboard 0.3.2 locally

- **WHEN** the verified right-panel icon patch is prepared as `0.3.2`
- **THEN** every active Taskboard version reference and artifact reports
  `0.3.2`
- **AND** the proposed future tag is `taskboard/v0.3.2`
- **AND** no tag or GitHub Release is created during preparation.
