# Taskboard Distribution Delta

## Purpose

Define reproducible, immutable Taskboard release and marketplace provenance.

## ADDED Requirements

### Requirement: Immutable npm release

Every Taskboard release SHALL bind one package version, reviewed Git commit,
plugin-specific annotated Git tag, npm artifact, and GitHub release without
moving or replacing an existing version or tag. Build metadata and packed files
SHALL derive from the same versioned source tree, and credentials SHALL remain
outside tracked files and observable output.

#### Scenario: Prepare Taskboard 0.3.0

- **WHEN** the maintainer prepares `bb-plugin-taskboard@0.3.0`
- **THEN** the manifest, lock metadata, production build, and dry-run tarball
  all identify `0.3.0`
- **AND** root checks pass with no uncommitted release changes
- **AND** no remote release mutation occurs before exact approval

### Requirement: Marketplace range alignment

The BB Community Taskboard entry SHALL reference a published npm semver range
that can resolve the current release while preserving the reviewed listing
identity, ownership, description, compatibility, tags, and vendored icon.

#### Scenario: Advance across a pre-1.0 minor boundary

- **GIVEN** the current marketplace range is `^0.1.2`
- **WHEN** Taskboard releases `0.3.0`
- **THEN** the entry advances to `^0.3.0`
- **AND** marketplace schema/build validation passes locally
- **AND** source verification passes after npm exposes `0.3.0`
