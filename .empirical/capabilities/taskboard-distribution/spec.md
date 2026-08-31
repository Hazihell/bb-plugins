# Taskboard Distribution Specification

## Purpose

Define reproducible, immutable Taskboard release and marketplace provenance.

## Requirements

### Requirement: Marketplace range alignment

The BB Community Taskboard entry SHALL reference the public Git repository,
`plugins/taskboard` subdirectory, `^0.3.3` semver range, and `taskboard/` tag
prefix that resolve the reviewed immutable Git release while preserving the
listing identity and vendored icon.

#### Scenario: Resolve the corrected marketplace release

- **WHEN** the Marketplace validates Taskboard range `^0.3.3`
- **THEN** it resolves `taskboard/v0.3.3` from the public repository
- **AND** the entry contains no obsolete model-drafting claim
- **AND** schema/build and direct Git-source liveness checks pass without npm.

### Requirement: Immutable Git release

Every Taskboard release SHALL bind one reviewed Git commit whose active
manifest, lockfile, release-facing documentation, distribution tests, and
build metadata agree on the exact version to one immutable
`taskboard/vX.Y.Z` annotated tag and one GitHub Release. A Taskboard workspace
SHALL remain private/non-publishable and SHALL omit npm publication hooks.
Release preparation SHALL stop before remote mutation unless the exact source
commit, tag, release, destinations, and commands are approved.

#### Scenario: Prepare Taskboard 0.3.3 locally

- **WHEN** the Marketplace reviewer fixes are prepared as `0.3.3`
- **THEN** every active Taskboard version reference and artifact reports
  `0.3.3`
- **AND** the proposed future tag is `taskboard/v0.3.3`
- **AND** no remote mutation occurs before exact approval.

### Requirement: Production-only subdirectory build

Every Taskboard Git release SHALL declare every package required to build its
source after development dependencies are omitted, without relying on a
workspace-root hoist or unpublished package.

#### Scenario: Build an isolated Git subtree

- **GIVEN** only the released `plugins/taskboard` source closure is present
- **WHEN** npm installs with scripts, dev dependencies, and optional
  dependencies omitted and BB builds the plugin
- **THEN** the SDK runtime contract import and every other build import resolve
- **AND** valid server and app artifacts are produced.
