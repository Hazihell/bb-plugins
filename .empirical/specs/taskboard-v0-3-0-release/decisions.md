# Decisions: Taskboard 0.3.0 Release

## D-001: Release as 0.3.0

Status: Accepted

### Evidence

The release adds several user-visible feature families and safety contracts,
while the current public npm/tag release is `0.2.0`.

### Options

- Patch `0.2.1`.
- Minor `0.3.0`.
- Major `1.0.0`.

### Chosen approach

Use `0.3.0`, the next pre-1.0 minor release.

### Trade-offs and risks

Consumers tracking `^0.2.0` will not auto-select it, which is appropriate for a
material pre-1.0 feature release and requires an explicit marketplace range
advance.

### Verification

Check npm/tag absence, version every artifact, and verify package metadata.

## D-002: Preserve npm as the marketplace source

Status: Accepted

### Evidence

Taskboard is already published as `bb-plugin-taskboard`, documentation and
badges use npm, and the user selected authenticated npm publication.

### Options

- Switch the marketplace to Git tags.
- Keep npm and advance the range.

### Chosen approach

Publish `bb-plugin-taskboard@0.3.0` and change only the marketplace range to
`^0.3.0`.

### Trade-offs and risks

The marketplace PR must wait for public npm propagation, but existing direct
npm consumers and provenance remain consistent.

### Verification

Confirm npm publication, then pass marketplace `npm run check` before PR.

## D-003: Separate local preparation from remote release

Status: Accepted

### Evidence

Publication, pushes, tags, releases, merges, and marketplace PRs are external
mutations; the release workflow requires exact separate approval.

### Options

- Publish opportunistically after checks.
- Prepare local immutable commits and then show exact commands.

### Chosen approach

Complete local versioning, validation, tarball inspection, release commit, and
marketplace commit first; request approval before the first remote command.

### Trade-offs and risks

This adds one approval pause but makes every remote target and command auditable.

### Verification

Ensure no remote ref/package/PR changes during preparation and show exact hashes.
