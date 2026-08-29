# Usage Tracker Distribution Specification

## Purpose

Define reproducible, immutable Usage Tracker releases and marketplace
provenance for the plugin-specific Git tag namespace.

## Requirements

### Requirement: Immutable Usage Tracker Git release

Every Usage Tracker release SHALL bind one reviewed commit with matching active
manifest, lockfile, changelog, documentation, distribution tests, and build
metadata to one new annotated `usage-tracker/vX.Y.Z` tag and one GitHub Release.
Existing tags SHALL never move, Usage Tracker SHALL remain a private,
non-publishable npm workspace distributed from Git, and preparation SHALL stop
before remote mutation unless exact authorization is supplied.

#### Scenario: Prepare Usage Tracker 0.1.4 locally

- **WHEN** the complete merged provider/window behavior is prepared as `0.1.4`
- **THEN** every active Usage Tracker version reference and artifact reports
  `0.1.4`
- **AND** the proposed future tag is `usage-tracker/v0.1.4`
- **AND** no tag or GitHub Release is created during preparation.

### Requirement: Usage Tracker marketplace Git provenance

The BB Community Usage Tracker entry SHALL resolve the public bb-plugins Git
repository, `plugins/usage-tracker` subdirectory, compatible release range, and
`usage-tracker/` tag prefix instead of the retired npm package. Coupled
marketplace source migrations SHALL remain together when either unchanged
legacy npm entry would make catalog liveness fail.

#### Scenario: Resolve Usage Tracker 0.1.3 from the marketplace

- **WHEN** the public `usage-tracker/v0.1.3` tag exists and the marketplace
  validates range `^0.1.3`
- **THEN** the entry resolves the exact public Git release from the plugin
  subdirectory
- **AND** marketplace build and source-liveness checks pass without npm
