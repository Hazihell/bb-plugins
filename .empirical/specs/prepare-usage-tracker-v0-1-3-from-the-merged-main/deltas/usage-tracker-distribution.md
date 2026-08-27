# Usage Tracker Distribution Delta

## Purpose

Define reproducible, immutable Usage Tracker releases and marketplace
provenance for the plugin-specific Git tag namespace.

## ADDED Requirements

### Requirement: Immutable Usage Tracker Git release

Every Usage Tracker release SHALL bind one reviewed commit with matching active
manifest, lockfile, changelog, documentation, distribution tests, and build
metadata to one new annotated `usage-tracker/vX.Y.Z` tag and one GitHub Release.
Existing tags SHALL never move, and Usage Tracker SHALL remain a private,
non-publishable npm workspace distributed from Git.

#### Scenario: Prepare Usage Tracker 0.1.3

- **WHEN** the merged provider/window fixes and compact-limit feature are ready
  for release
- **THEN** one reviewed local commit carries every active `0.1.3` reference
- **AND** the proposed tag is `usage-tracker/v0.1.3`
- **AND** no remote release mutation occurs before exact approval

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
