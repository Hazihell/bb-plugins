# Taskboard Distribution Specification

## Purpose

Define reproducible, immutable Taskboard release and marketplace provenance.

## Requirements

### Requirement: Immutable npm release

Every Taskboard release SHALL bind one package version, reviewed Git commit,
plugin-specific annotated Git tag, verified npm archive, and GitHub release
without moving or replacing an existing version or tag. The real archive SHALL
be created with scripts disabled, inspected, identified by a recorded SHA-256,
rechecked immediately before publishing that exact file with lifecycle scripts
disabled, and published with credentials scoped to that one process.

#### Scenario: Prepare Taskboard 0.3.0 after review fixes

- **WHEN** the final product source differs from an earlier candidate archive
- **THEN** Taskboard rebuilds and replaces the local candidate with a newly
  inspected archive derived from the final source
- **AND** exact-version npm absence, archive SHA-256, and Git tag absence are
  reconfirmed before remote approval

### Requirement: Marketplace range alignment

The BB Community Taskboard entry SHALL reference a published npm semver range
that resolves the current release while preserving listing identity. Before a
marketplace push, verification SHALL assert the exact package version is public
in addition to running the marketplace's package-level liveness check.

#### Scenario: Publish before marketplace submission

- **WHEN** `bb-plugin-taskboard@0.3.0` is published
- **THEN** an exact-version registry query returns `0.3.0`
- **AND** marketplace build/liveness checks pass before its branch is pushed
